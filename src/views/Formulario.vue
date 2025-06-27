<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="form-container">
        <h2>Registro de Estudiante</h2>
        <form @submit.prevent="submitForm">
            <!-- Campos del formulario -->
            <div class="form-group">
                <label>Matrícula:</label>
                <input type="text" v-model="estudiante.matricula" required>
            </div>

            <div class="form-group">
                <label>Nombres*:</label>
                <input type="text" v-model="estudiante.nombres" required>
            </div>

            <div class="form-group">
                <label>Apellidos*:</label>
                <input type="text" v-model="estudiante.apellidos" required>
            </div>

            <div class="form-group">
                <label>Email*:</label>
                <input type="email" v-model="estudiante.email" required>
            </div>

            <div class="form-group">
                <label>Teléfono*:</label>
                <input type="tel" v-model="estudiante.telefono" required>
            </div>

            <div class="form-group">
                <label>Programa Educativo:</label>
                <input type="text" v-model="estudiante.programa">
            </div>

            <div class="form-group">
                <label>Cuatrimestre:</label>
                <input type="text" v-model="estudiante.cuatrimestre">
            </div>

            <button type="submit">Guardar</button>
        </form>

        <h3>Estudiantes Registrados</h3>
        <ul>
            <li v-for="(est, idx) in estudiantes" :key="idx">
                {{ est.matricula }} - {{ decryptField(est.nombres) }}
                {{ decryptField(est.apellidos) }} - {{ decryptField(est.email) }}
            </li>
        </ul>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { db } from '../firebase'
import { collection, addDoc, onSnapshot } from 'firebase/firestore'
import { encrypt, decrypt } from '@/utils/crypto'

export default {
    setup() {
        const estudiante = ref({
            matricula: '',
            nombres: '',
            apellidos: '',
            email: '',
            telefono: '',
            programa: '',
            cuatrimestre: ''
        })

        const estudiantes = ref([])

        // Cargar estudiantes en tiempo real
        onMounted(() => {
            const estudiantesRef = collection(db, 'estudiantes')
            onSnapshot(estudiantesRef, (snapshot) => {
                estudiantes.value = []
                snapshot.forEach(doc => {
                    estudiantes.value.push({ id: doc.id, ...doc.data() })
                })
            })
        })

        const submitForm = async () => {
            // Cifrar campos sensibles
            const estudianteCifrado = {
                ...estudiante.value,
                nombres: encrypt(estudiante.value.nombres),
                apellidos: encrypt(estudiante.value.apellidos),
                email: encrypt(estudiante.value.email),
                telefono: encrypt(estudiante.value.telefono)
            }

            try {
                await addDoc(collection(db, 'estudiantes'), estudianteCifrado)
                // Resetear formulario
                estudiante.value = {
                    matricula: '',
                    nombres: '',
                    apellidos: '',
                    email: '',
                    telefono: '',
                    programa: '',
                    cuatrimestre: ''
                }
            } catch (e) {
                console.error("Error adding document: ", e)
            }
        }

        const decryptField = (value) => {
            return value ? decrypt(value) : ''
        }

        return { estudiante, estudiantes, submitForm, decryptField }
    }
}
</script>