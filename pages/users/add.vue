<template>
    <section>
        <b-container>
            <b-row>
                <b-col>
                    <h2 class="text-center font-weight-lighter mb-5">Invite User</h2>
                </b-col>
            </b-row>
            <b-row align-h="center">
                <b-col lg="6" md="9">
                    <error-alert />
                    <b-form @submit.prevent="doAdd">
                        <b-form-row>
                            <b-col>
                                <b-form-group
                                    :invalid-feedback="validation.getInvalidFeedback('name')"
                                    :state="validation.getState('name')"
                                    label="Name*"
                                >
                                    <b-form-input v-model="request.name" />
                                </b-form-group>
                            </b-col>
                        </b-form-row>
                        <b-form-row>
                            <b-col>
                                <b-form-group
                                    :invalid-feedback="validation.getInvalidFeedback('surname')"
                                    :state="validation.getState('surname')"
                                    label="Surname*"
                                >
                                    <b-form-input v-model="request.surname" />
                                </b-form-group>
                            </b-col>
                        </b-form-row>
                        <b-form-row>
                            <b-col>
                                <b-form-group
                                    :invalid-feedback="validation.getInvalidFeedback('email')"
                                    :state="validation.getState('email')"
                                    label="Email*"
                                >
                                    <b-form-input v-model="request.email" type="email" />
                                </b-form-group>
                            </b-col>
                        </b-form-row>
                        <LoaderButton
                            :is-loading="isLoading"
                            class="mt-5 text-center"
                            text="send invite"
                        />
                    </b-form>
                </b-col>
            </b-row>
        </b-container>
    </section>
</template>
<script lang="ts" setup>
import { useStores } from '~/composables/useStores'
import type { UserModel } from '~/plugins/weavr-multi/api/models/users/models/UserModel'
import {
    type CreateUserRequestModel,
    INITIAL_USER_REQUEST,
    type UserRequest,
    UserSchema,
} from '~/plugins/weavr-multi/api/models/users/requests/CreateUserRequestModel'
import ErrorAlert from '~/components/molecules/ErrorAlert.vue'
import LoaderButton from '~/components/atoms/LoaderButton.vue'
import useZodValidation from '~/composables/useZodValidation'

definePageMeta({
    middleware: 'kyVerified',
})

const router = useRouter()

const { errors, users } = useStores(['errors', 'users'])
const isLoading = ref(false)
const request: UserRequest = reactive(INITIAL_USER_REQUEST())

const validation = computed(() => {
    return useZodValidation(UserSchema, request)
})

const doAdd = async () => {
    await validation.value.validate()

    if (validation.value.isInvalid.value) {
        return null
    }

    await users
        ?.add(request as CreateUserRequestModel)
        .then((res) => {
            userAdded(res.data)
        })
        .catch((err) => {
            errors?.setError(err)
            isLoading.value = false
        })
}

const userAdded = async (res: UserModel) => {
    await users?.inviteSend(res.id)
    await router.push('/users')
    isLoading.value = false
}
</script>
