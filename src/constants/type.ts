export const TokenType = {
  ForgotPasswordToken: 'ForgotPasswordToken',
  AccessToken: 'AccessToken',
  RefreshToken: 'RefreshToken',
  TableToken: 'TableToken'
} as const

export const Role = {
    Owner : "Owner",
    Employee : "Employee",
    Guest: 'Guest'
} as const 

export const RoleValues = [Role.Owner, Role.Employee] as const 