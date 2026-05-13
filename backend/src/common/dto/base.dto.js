import Joi from "joi";
import ApiError from "../utils/api-error.js";

class BaseDto{
    static schema = Joi.object({});
        static validate(data){
            const {error, value}=this.schema.validate(data,{
                abortEarly:true,
                stripUnknown:true,
            });
            if(error) {
                const errors = error.details.map((d)=>d.message)
                return {error, value:null};
            }
            return {error: null, value};
        }
    
}

export default BaseDto;