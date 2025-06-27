<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div>
        <ul v-if="errors.length > 0" class="error-list">
            <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
        </ul>
    </div>
</template>

<script>
import { computed } from 'vue'

export default {
    props: ['password'],
    setup(props) {
        const errors = computed(() => {
            const errs = []
            if (props.password.length < 8) {
                errs.push("Mínimo 8 caracteres")
            }
            if (!/[A-Z]/.test(props.password)) {
                errs.push("Al menos una mayúscula")
            }
            if (!/[a-z]/.test(props.password)) {
                errs.push("Al menos una minúscula")
            }
            if (!/[._\-!$@?%#&]/.test(props.password)) {
                errs.push("Al menos un carácter especial (._-!$@?%#&)")
            }
            if (/(.)\1\1|abc|xyz|123|987|000/i.test(props.password)) {
                errs.push("No se permiten secuencias o repeticiones")
            }
            return errs
        })

        return { errors }
    }
}
</script>

<style scoped>
.error-list {
    color: #ff3860;
    font-size: 0.8em;
    margin-top: 5px;
    padding-left: 10px;
    list-style-type: none;
}
</style>