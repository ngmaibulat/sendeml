export type smtpAuth = {
    user: string
    pass: string
}

export type smtpOptions = {
    host: string
    port: number
    secure: boolean
    connectionTimeout: number
    auth?: smtpAuth
}
