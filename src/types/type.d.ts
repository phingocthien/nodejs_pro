import { Role as prismaRole , User as prismaUser } from "@prisma/client"; 

declare global {
  namespace Express {
    interface User extends prismaUser {
     role?:prismaRole
     sumCart?:number
     id: number,
     username?: string | null,
     fullName?: string | null,
     address?: string | null,
     phone?: string | null,
     accountType: string,
     avatar?: string | null,
     roleId: number,
  }
}
}