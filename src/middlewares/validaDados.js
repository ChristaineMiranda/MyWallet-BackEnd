export default function validaDados(schema, dados) {

    const validation = schema.validate(dados, { abortEarly: false });
    if (validation.error) {
        const erros = validation.error.details.map((detail) => (detail.message));
        return erros
    }
}