import 'dotenv/config';
import * as joi from 'joi';
/* 
* Instalar 
* - npm i dotenv
* - npm i joi
* */

interface EnvVars {
    PORT         : number;
    DATABASE_URL : string;
    NODE_ENV     : string;
    NATS_SERVERS : string[];
}

const envsSchema = joi.object({

    PORT         : joi.number().required(),
    DATABASE_URL : joi.string().required(),
    NODE_ENV     : joi.string().required(),
    NATS_SERVERS : joi.array().items( joi.string() ).required()
})
.unknown(true) //! Acepta todas las propiedad, no solo las validadas


const {error, value } = envsSchema.validate ({
    ...process.env,
    NATS_SERVERS : process.env.NATS_SERVERS?.split(',')
});

if ( error ) throw new Error(`Config Validation Error: ${ error.message }`);
  

const envVars: EnvVars = value;  

export const envs = {

    PORT         : envVars.PORT,
    DATABASE_URL : envVars.DATABASE_URL,
    NODE_ENV     : envVars.NODE_ENV,
    NATS_SERVERS : envVars.NATS_SERVERS
}