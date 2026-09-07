export const createPrivateLabWitnesses = (privateState) => ({
    getHemoglobin(context) {
        return [context.privateState, privateState.hemoglobin];
    },
});
