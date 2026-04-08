import http from "@/lib/http";
import { AccountResType } from "@/schemaValidations/account.schema";



const accountApiRequest = {
    me : () => http.get<AccountResType>("account/me")
    
}

export default accountApiRequest;