<!-- eslint-disable vue/multi-word-component-names -->
<!-- src/views/Dashboard.vue -->
<template>
    <div class="dashboard">
        <h1>¡Felicidades, estás logueado!</h1>

        <div v-if="userData" class="user-data">
            <h2>Tus datos:</h2>
            <ul>
                <li><strong>Matrícula:</strong> {{ userData.matricula }}</li>
                <li><strong>Nombres:</strong> {{ decryptField(userData.nombres) }}</li>
                <li><strong>Apellidos:</strong> {{ decryptField(userData.apellidos) }}</li>
                <li><strong>Email:</strong> {{ decryptField(userData.email) }}</li>
                <li><strong>Teléfono:</strong> {{ decryptField(userData.telefono) }}</li>
                <li><strong>Programa Educativo:</strong> {{ userData.programa }}</li>
                <li><strong>Cuatrimestre:</strong> {{ userData.cuatrimestre }}</li>
            </ul>
        </div>
        <div v-else>
            <p>Cargando datos...</p>
        </div>

        <button @click="logout">Cerrar Sesión</button>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { auth, db } from '../firebase'
import { signOut } from 'firebase/auth'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { decrypt } from '@/utils/crypto'
import { useRouter } from 'vue-router'


export default {
    setup() {
        const userData = ref(null)
        const router = useRouter()

        // Función para desencriptar campos
        const decryptField = (value) => {
            return value ? decrypt(value) : ''
        }

        // Obtener datos del usuario desde Firestore
        const fetchUserData = async () => {
            const user = auth.currentUser
            if (!user) {
                router.push('/')
                return
            }

            const q = query(collection(db, 'usuarios'), where('userId', '==', user.uid))
            const querySnapshot = await getDocs(q)

            if (!querySnapshot.empty) {
                // Tomamos el primer documento (debería ser único por usuario)
                userData.value = querySnapshot.docs[0].data()
            } else {
                console.error('No se encontraron datos para el usuario')
            }
        }

        // Cerrar sesión
        const logout = async () => {
            try {
                // Versión CORRECTA para Firebase v9
                await signOut(auth);
                router.push('/');
            } catch (error) {
                console.error('Error al cerrar sesión:', error);
            }
        };

        onMounted(() => {
            fetchUserData()
        })

        return {
            userData,
            decryptField,
            logout
        }
    }
}
</script>

<style scoped>
.dashboard {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    text-align: center;
}

h1 {
    color: #42b983;
    margin-bottom: 30px;
}

.user-data {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
    text-align: left;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    margin-bottom: 10px;
    padding: 8px;
    border-bottom: 1px solid #eee;
}

li:last-child {
    border-bottom: none;
}

button {
    padding: 10px 20px;
    background-color: #42b983;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
}

button:hover {
    background-color: #e70808;
}
</style>