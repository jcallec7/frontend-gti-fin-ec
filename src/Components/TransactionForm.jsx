import Select from 'react-select';
import {useEffect, useState} from "react";
import {Controller, useForm} from "react-hook-form";

const IDType = [
    {
        label: 'Cédula', value: 'C'
    },
    {
        label: 'RUC', value: 'R'
    }
];

const accountType = [
    {
        label: 'AHORROS', value: '1'
    },
    {
        label: 'CORRIENTE', value: '2'
    }
];

const creditPerson = {
    institution: '2',
    identificationType: 'C',
    identification: '0102514106',
    accountType: '1',
    accountNumber: '100004',
}

const debitPerson = {
    institution: '0',
    identificationType: '',
    identification: '',
    accountType: 0,
    account: ''
}

const bodyRequest = {

    chanel: "ELAKE",
    debitPerson: {},
    creditPerson: {},
    amount: 0.0,
    amountDelivery: 0.0,
    orderId: "1",
    otp: "12345",
    ip: "192.168.1.1"

}

export const TransactionForm = () => {

    const [institutions, setInstitutions] = useState([]);
    const [token, setToken] = useState([]);
    const [transaction, setTransaction] = useState([]);

    const {
        control,
        handleSubmit
    } = useForm();

    const onSubmit = (data) => {

        debitPerson.institution = data.selectInstitution.value;
        debitPerson.identificationType = data.selectIDType.value;
        debitPerson.identification = data.inputIDNumber;
        debitPerson.accountType = data.selectAccountType.value;
        debitPerson.account = data.inputAccountNumber;

        bodyRequest.debitPerson = debitPerson;
        bodyRequest.creditPerson = creditPerson;
        bodyRequest.amount += data.inputAmount;

        fetch('https://desarrollo.gti.fin.ec/boton-web-api-ws-1.0/coopagos/web/private/validation',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token.token
            },
            body: JSON.stringify(bodyRequest),
        })
            .then((response) => response.json())
            .then((data) => setTransaction(data))

    }

    useEffect(() => {

        fetch('https://desarrollo.gti.fin.ec/boton-web-api-ws-1.0/coopagos/web/public/institution')
            .then((response) => response.json())
            .then((data) => setInstitutions(data))

    }, []);

    useEffect(() => {
        fetch('https://devservicios.gti.fin.ec/seguridades-api-ws-1.0/coopagos/token',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                usuario: "gti",
                clave: "aY9T1MFpCWnwuuuMYe030sEUVG1ZXPe1"
            }),
        })
            .then((response) => response.json())
            .then((data) => setToken(data))
    }, []);

    return (
        <div>
            <h1>Transaction Form</h1>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>Institucion</label>
                    <Controller
                        name="selectInstitution"
                        rules={{ required: true }}
                        control={control}
                        render={({ field }) => (
                            <Select {...field} options={institutions.map((institution) => (
                                {label: institution.nombre, value: institution.codigoInstitucion}
                            ))}/>
                        )}
                    />

                </div>
                <br/>
                <div>
                    <label>Tipo de documento</label>
                    <Controller
                        name="selectIDType"
                        rules={{ required: true }}
                        control={control}
                        render={({ field }) => (
                            <Select {...field}  options={IDType} />
                        )}
                    />
                </div>
                <br/>
                <div>
                    <label>Numero de documento</label>
                    <br/>
                    <Controller
                        name="inputIDNumber"
                        defaultValue={'0105213136'}
                        rules={{ required: true }}
                        control={control}
                        render={({ field }) => <input {...field} />}
                    />
                </div>
                <br/>
                <div>
                    <label>Tipo de cuenta</label>
                    <Controller
                        name="selectAccountType"
                        rules={{ required: true }}
                        defaultValue={accountType[0]}
                        control={control}
                        render={({ field }) => (
                            <Select {...field}  defaultValue={accountType[0]} options={accountType}/>
                        )}
                    />
                </div>
                <br/>
                <div>
                    <label>Numero de cuenta</label>
                    <br/>
                    <Controller
                        name="inputAccountNumber"
                        rules={{ required: true }}
                        control={control}
                        defaultValue={'2269539'}
                        render={({ field }) => <input {...field} />}
                    />
                </div>
                <br/>
                <div>
                    <label>Valor a transferir</label>
                    <br/>
                    <Controller
                        name="inputAmount"
                        rules={{ required: true }}
                        defaultValue={'1.0'}
                        control={control}
                        render={({ field }) => <input {...field} />}
                    />
                </div>
                <br/>
                <div>
                <button type="submit">Enviar</button>
                </div>

                <div>
                    <h1>Respuesta</h1>
                    <pre>{JSON.stringify(transaction)}</pre>

                </div>
            </form>

        </div>
    )
}