import AddEmployee from "@/app/manage/accounts/add-employee";
import http from "@/lib/http";
import { AccountListResType, AccountResType, CreateEmployeeAccountBodyType, UpdateEmployeeAccountBodyType } from "@/schemaValidations/account.schema";


const prefix = '/accounts'
const accountApiRequest = {
    me : () => http.get<AccountResType>(`${prefix}/me`),
    list : () => http.get<AccountListResType>(`${prefix}/list`),
    addEmployee : (body : CreateEmployeeAccountBodyType) => http.post<AccountResType>(prefix, body),
    updateEmployee: (id: number, body: UpdateEmployeeAccountBodyType) => http.put<AccountResType>(`${prefix}/detail/${id}`, body),
    deleteEmployee: (id: number) => http.delete<AccountResType>(`${prefix}/detail/${id}`),
    getEmployee : (id: number) => http.get<AccountResType>(`${prefix}/detail/${id}`)
}

export default accountApiRequest;