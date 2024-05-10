import * as bcrypt from "bcrypt";
import {config} from "../configs/config";
class PasswordService {
    public async hash(password: string): Promise<string> {
        return await bcrypt.hash(password, config.HASH_PASSWORD_ROUNDS);
    }
    public async compare(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }
}

export const passwordService = new PasswordService();
