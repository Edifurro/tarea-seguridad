<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="login-container">
        <h2>Inicio de Sesión</h2>
        <form @submit.prevent="login">
            <div class="form-group">
                <label>Email:</label>
                <input type="email" v-model="email" required>
            </div>

            <div class="form-group">
                <label>Contraseña:</label>
                <input type="password" v-model="password" required>
                <passwordvalidator :password="password" />
            </div>

            <button type="submit" class="login-btn">Ingresar</button>
            <button type="button" class="register-btn" @click="showRegister = true">Registrar Nuevo Usuario</button>
            <p v-if="error" class="error">{{ error }}</p>
        </form>

        <!-- Modal de Registro -->
        <div v-if="showRegister" class="modal">
            <div class="modal-content">
                <span class="close" @click="showRegister = false">&times;</span>
                <h2>Registro de Nuevo Usuario</h2>
                <form @submit.prevent="registerUser">
                    <div class="form-group">
                        <label>Matrícula:</label>
                        <input type="text" v-model="newUser.matricula" required>
                    </div>

                    <div class="form-group">
                        <label>Nombres*:</label>
                        <input type="text" v-model="newUser.nombres" required>
                    </div>

                    <div class="form-group">
                        <label>Apellidos*:</label>
                        <input type="text" v-model="newUser.apellidos" required>
                    </div>

                    <div class="form-group">
                        <label>Email*:</label>
                        <input type="email" v-model="newUser.email" required>
                    </div>

                    <div class="form-group">
                        <label>Teléfono*:</label>
                        <input type="tel" v-model="newUser.telefono" required>
                    </div>

                    <div class="form-group">
                        <label>Programa Educativo:</label>
                        <input type="text" v-model="newUser.programa">
                    </div>

                    <div class="form-group">
                        <label>Cuatrimestre:</label>
                        <input type="text" v-model="newUser.cuatrimestre">
                    </div>

                    <div class="form-group">
                        <label>Contraseña*:</label>
                        <input type="password" v-model="newUser.password" required>
                        <PasswordValidator :password="newUser.password" />
                    </div>

                    <button type="submit" class="create-user-btn">Crear Usuario</button>
                    <p v-if="registerError" class="error">{{ registerError }}</p>
                    <p v-if="registerSuccess" class="success">{{ registerSuccess }}</p>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db } from '../firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { collection, addDoc } from 'firebase/firestore'
import { encrypt } from '@/utils/crypto'
import PasswordValidator from '@/components/PasswordValidator.vue'
import { signInWithEmailAndPassword } from "firebase/auth";

export default {
    components: { PasswordValidator },
    setup() {
        const email = ref('')
        const password = ref('')
        const error = ref('')
        const showRegister = ref(false)
        const registerError = ref('')
        const registerSuccess = ref('')
        const router = useRouter()

        const newUser = ref({
            matricula: '',
            nombres: '',
            apellidos: '',
            email: '',
            telefono: '',
            programa: '',
            cuatrimestre: '',
            password: ''
        })

        const login = async () => {
            try {
                // Versión CORRECTA para Firebase v9
                await signInWithEmailAndPassword(auth, email.value, password.value);
                router.push('/dashboard');
            } catch (err) {
                error.value = "Credenciales inválidas: " + err.message;
            }
        };

        const registerUser = async () => {
            registerError.value = '';
            registerSuccess.value = '';

            try {
                // Crear usuario en Firebase Authentication (versión correcta)
                const userCredential = await createUserWithEmailAndPassword(
                    auth, // Pasar auth como primer parámetro
                    newUser.value.email,
                    newUser.value.password
                );

                const userId = userCredential.user.uid

                // 2. Cifrar datos sensibles
                const userData = {
                    matricula: newUser.value.matricula,
                    nombres: encrypt(newUser.value.nombres),
                    apellidos: encrypt(newUser.value.apellidos),
                    email: encrypt(newUser.value.email),
                    telefono: encrypt(newUser.value.telefono),
                    programa: newUser.value.programa,
                    cuatrimestre: newUser.value.cuatrimestre,
                    createdAt: new Date()
                }

                // 3. Guardar en Firestore
                await addDoc(collection(db, 'usuarios'), {
                    ...userData,
                    userId
                })

                registerSuccess.value = 'Usuario creado correctamente. Ahora puedes iniciar sesión.'

                // Limpiar formulario después de 2 segundos
                setTimeout(() => {
                    showRegister.value = false
                    newUser.value = {
                        matricula: '',
                        nombres: '',
                        apellidos: '',
                        email: '',
                        telefono: '',
                        programa: '',
                        cuatrimestre: '',
                        password: ''
                    }
                    registerSuccess.value = ''
                }, 2000)
                await signInWithEmailAndPassword(
                    auth, // Pasar auth como primer parámetro
                    newUser.value.email,
                    newUser.value.password
                );
                router.push('/dashboard');

            } catch (err) {
                registerError.value = "Error al registrar: " + err.message;
            }
        };

        return {
            email,
            password,
            error,
            login,
            showRegister,
            newUser,
            registerUser,
            registerError,
            registerSuccess
        }
    }
}
</script>

<style scoped>
.login-container {
    max-width: 400px;
    margin: 2rem auto;
    padding: 2rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    position: relative;
}

.form-group {
    margin-bottom: 1rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #333;
    font-size: 14px;
}

.form-group input {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e1e5e9;
    border-radius: 8px;
    font-size: 16px;
    transition: all 0.3s ease;
    box-sizing: border-box;
    background-color: #fafbfc;
}

.form-group input:focus {
    outline: none;
    border-color: #007bff;
    background-color: #fff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.form-group input:hover {
    border-color: #c6cbd1;
}

.error {
    color: #ff3860;
    margin-top: 1rem;
}

.success {
    color: #23d160;
    margin-top: 1rem;
}

.register-btn {
    background-color: #42b983;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
    display: block;
    width: 100%;
}

.login-btn {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 15px 20px;
    border-radius: 8px;
    cursor: pointer;
    margin-bottom: 10px;
    display: block;
    width: 100%;
    font-size: 18px;
    font-weight: bold;
}

.login-btn:hover {
    background-color: #0056b3;
}

.register-btn:hover {
    background-color: #3aa876;
}

.create-user-btn {
    background-color: #28a745;
    color: white;
    border: none;
    padding: 15px 20px;
    border-radius: 8px;
    cursor: pointer;
    margin-top: 15px;
    margin-bottom: 10px;
    display: block;
    width: 100%;
    font-size: 16px;
    font-weight: bold;
    transition: all 0.3s ease;
}

.create-user-btn:hover {
    background-color: #218838;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(40, 167, 69, 0.3);
}

/* Estilos para el modal */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
}

.close {
    float: right;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
}

.close:hover {
    color: #ff3860;
}
</style>