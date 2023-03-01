// SIMULADOR BANCARIO 
// Funciones:
//      1) Consulta de saldo
//      2) Abono
//      3) Simulación de crédito
//      4) Transferencia bancaria
//      5) Historial de acciones (envíar a backoffice).
//      6) Cerrar sesión

// VARIABLES
const intRate = .015

// USUARIOS
const users = [
    { name: 'gonzalo@salazar.com', pass: 'gonza1234', balance: 100000, eventLog: [] },
    { name: 'julieta@venegas.net', pass: '12ju34', balance: 12345, eventLog: [] },
    { name: 'paz@hurtado.cl', pass: '1234paz', balance: 4312, eventLog: [] },
]

// FUNCIONES Y CLASES
function consultaSaldo(balance, eventLog) {
    alert(`Su saldo actual es de ${balance}`)
    eventLog.push(`${new Date()} \nEl usuario consultó su saldo, ${balance}.`)
}

function cerrarSesion(eventLog) {
    alert(`Muchas gracias por usar nuestros servicios ¡Hasta una próxima ocasión!`)
    eventLog.push(`${new Date()} \nEl usuario terminó la sesión.`)
}

function transferenciaBancaria(balance, eventLog) {
    let monto = Number(prompt(`Ingrese el monto a transferir.`))

    if (monto > balance || monto <= 0 || isNaN(monto)) {
        alert(`No es posible realizar la transacción. 
               Usted está intentando transferir un valor que no corresponde.
               Se volverá al menú inicial`)
        eventLog.push(`${new Date()} \nEl usuario ha ingresado un valor incorrecto. Transferencia incompleta.`)
    }

    else {
        balance -= monto
        alert(`Usted ha transferido ${monto} de manera exitosa. Su nuevo saldo es de ${balance}`)
        eventLog.push(`${new Date()} \nEl usuario ha realizado una transferencia exitosa. Saldo actual ${balance}`)
    }

    return [balance, monto]
}

function abono(balance, eventLog) {
    let monto = Number(prompt(`Ingrese el monto a abonar.`))

    if (monto <= 0 || isNaN(monto)) {
        alert(`No es posible realizar la transacción. 
        Usted está intentando abonar un valor que no corresponde.
        Se volverá al menú inicial`)
        eventLog.push(`${new Date()} \nEl usuario ha ingresado un valor incorrecto. Abono incompleto.`)
    }

    else {
        balance += monto
        alert(`Usted ha abonado ${monto} de manera exitosa. Su nuevo saldo es de ${balance}`)
        eventLog.push(`${new Date()} \nEl usuario ha realizado un abono exitoso. Saldo actual ${balance}`)
    }

    return balance
}

function simuladorCredito(balance, intRate, eventLog) {

    dataCalcCredito = infoCredito(eventLog)
    //                                income                intr    instalments             loan
    dataAprobCredito = calculoCredito(dataCalcCredito[0], intRate, dataCalcCredito[1], dataCalcCredito[2], eventLog)

    //                           balance    instalments         loan                intereses      detalle cuota         
    balance = aprobacionCredito(balance, dataCalcCredito[1], dataCalcCredito[2], dataAprobCredito[0], dataAprobCredito[1], eventLog)
    return balance
}


function infoCredito(eventLog) {

    let on = true
    while (on) {

        let income = Number(prompt(`Ingrese nivel de ingreso/renta líquido/a percibido.`))
        let instalments = Number(prompt(`Ingrese el número de meses en el que desea cancelar sus cuotas.`))
        let montoLoan = Number(prompt(`Ingrese el monto a solicitar en préstamo.`))

        if (typeof montoLoan != 'number' || isNaN(montoLoan) || isNaN(instalments) || isNaN(income) || typeof income != 'number' || typeof instalments != 'number' ||
            montoLoan < 0 || income < 0) {

            eventLog.push(`${new Date()} \nEl usuario ha ingresado valor(es) incorrecto(s).`)
            alert(`Usted ha ingresado un valor que no corresponde, vuelva a ingresar su información.`)
            continue
        }

        eventLog.push(`${new Date()} \nInfo de solicitud crédito, ingreso ${income}, cuotas ${instalments}, y monto préstamo ${montoLoan}`)
        return [income, instalments, montoLoan]
    }


}

function calculoCredito(income, intRate, instalments, montoLoan, eventLog) {

    let tasa = 0
    if (income < 100000) {
        tasa = intRate
    }

    else if (income >= 100000 && income <= 500000) {
        tasa = intRate + .002
    }

    else {
        tasa = intRate + .008
    }

    let totalIntereses = 0
    for (i = 0; i < instalments; i++) {
        totalIntereses += montoLoan * (Math.pow((1 + tasa), i) - 1)
    }

    let detalleCuota = (montoLoan + totalIntereses) / instalments

    eventLog.push(`${new Date()} \nInfo de crédito calculado, préstamo, intereses totales ${totalIntereses}, y valor cuota mensual ${detalleCuota}`)
    return [totalIntereses, detalleCuota]
}

function aprobacionCredito(balance, instalments, montoLoan, totalIntereses, detalleCuota, eventLog) {

    let onContinue = true
    while (onContinue) {
        let okPrestamo = Number(prompt(`El crédito solicitado es de ${montoLoan}. El valor cada cuota es ${detalleCuota.toFixed(1)}, las que deben ser canceladas en un periodo de ${instalments} meses. El monto total a pagar por el prestamo asciende ${(montoLoan + totalIntereses).toFixed(1)}. En caso de aceptar ingrese (1); en caso contrario ingrese (2).`))

        if (okPrestamo === 1) {
            alert(`Su prestamo de ${montoLoan} ha sido aprobado. Su balance actualizado es de ${balance + montoLoan}`)
            eventLog.push(`${new Date()} \nUsuario ha aceptado condiciones de crédito. Se otorgan ${montoLoan} en ${instalments} cuotas mensuales.`)
            return balance + montoLoan
        }

        else if (okPrestamo === 2) {
            alert(`Usted ha cancelado su solicitud de préstamo. Esta operación queda sin efecto.`)
            eventLog.push(`${new Date()} \nUsuario ha rechazado condiciones de crédito.`)
            return balance
        }

        else {
            alert(`Usted ha ingresado un valor que no corresponde, vuelva a intentarlo.`)
            eventLog.push(`${new Date()} \nEl usuario ha ingresado valor(es) incorrecto(s).`)
            continue
        }
    }
}

function consultarLogEventos(eventLog) {
    eventLog.forEach(function (event) {
        console.log(event)
    })
}

function moduloBanco(balance, eventLog, intRate) {

    let on = true
    while (on) {

        let option = Number(prompt(`Bienvenido a banco simulador, favor ingrese la opción que desea:
                1 : Consulta de saldo.
                2 : Abono.
                3 : Simulación de crédito.
                4 : Transferencia bancaria.
                5 : Historial de acciones (enviar reporte a backoffice).
                6 : Cerrar sesión.`))

        if (option === 1) {
            consultaSaldo(balance, eventLog)
        }

        else if (option === 2) {
            // balance = abono(balance, eventLog)
            balance = abono(balance, eventLog)
        }

        else if (option === 3) {
            balance = simuladorCredito(balance, intRate, eventLog)
        }

        else if (option === 4) {
            balance = transferenciaBancaria(balance, eventLog)[0]
        }

        else if (option === 5) {
            consultarLogEventos(eventLog)
        }

        else if (option === 6) {
            on = false
            cerrarSesion(eventLog)
            return 'off'
        }

        else {
            alert(`Usted ha ingresado una opción incorrecta, favor inténtelo nuevamente.`)
            eventLog.push(`${new Date()} \nUsuario usa opción errónea.`)
        }

    }
}

function login(users) {

    const userAsked = prompt(`Este es el portal de acceso a banco simulador, favor ingrese su usuario registrado`)

    const userExist = users.some(i => i.name === userAsked)

    if (userExist) {

        const userArray = users.filter(i => i.name === userAsked)

        let on = true
        let count = 0
        while (on) {

            count += 1
            const passAsked = prompt(`Escriba su contraseña, por favor`)

            if (userArray[0].pass === passAsked) {
                on = false
                alert(`Usted ha ingresado con éxito.`)
                // a futuro agregar el log del inicio de sesión
                return ['success', userArray[0].name]
            }

            else if (count < 3) {
                alert(`Usted ha una contraseña incorrecta. Le quedan ${3 - count} intentos.`)
            }

            else {
                alert(`Usted ha excedido el número de intentos.`)
                return 'error'
            }
        }
    }

    else {
        alert(`Usuario no existe en nuestros registros. Vuelva a intentar con un usuario registrado.`)
        return 'error'
    }
}

class User {
    constructor(name, pass, balance, eventLog) {
        this.name = name;
        this.pass = pass;
        this.balance = 0;
        this.eventLog = [];
    }
}

function crearUsuario(users) {

    const newName = prompt(`Favor ingresar un nombre de usuario`)

    const userExist = users.some(i => i.name === newName)

    if (userExist) {
        alert(`El usuario ya existe, diríjase a inicio de sesión.`)
    }

    else {
        const newPass = prompt(`Favor ingrese una contraseña para su usuario.`)

        users.push(new User(newName, newPass))
        alert(`El usuario se ha registrado con éxito, favor inicie sesión.`)
        // a futuro agregar log de registro nuevo usuario
    }
}

function buscarIndex(users, loginResult) {
    let index = 0
    for (const user of users) {

        if (user.name == loginResult[1]) {
            return index
        }

        else {
            index += 1
        }
    }

    return index
}


function inicioPagina() {

    let on = true
    while (on) {

        let option = Number(prompt(`Este es el inicio de banco simulador. Favor seleccione la acción que desea:
            1:  Iniciar sesión.
            2:  Crear usuario.`
        ))

        if (option === 1) {
            const loginResult = login(users)

            if (loginResult[0] === 'success') {

                index = buscarIndex(users, loginResult)

                systemStatus = moduloBanco(users[index].balance, users[index].eventLog, intRate)

                if (systemStatus === 'off') {
                    console.log(users)
                    break
                }
            }

            else if (loginResult === 'error') {
                continue
            }

        }

        else if (option === 2) {
            crearUsuario(users)
            continue
        }

        else {
            alert(`Usted ha ingresado una opción incorrecta, favor inténtelo nuevamente.`)
            continue
        }

    }
}

inicioPagina()


