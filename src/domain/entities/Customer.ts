import { CustomerId } from "../../shared/types/BrandedTypes";
import { Email } from "../value-objects/Email";

export class Customer {
    private readonly id: CustomerId;
    private readonly name: string;
    private email: Email;

    private constructor(id: CustomerId, name: string, email: Email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }

    public static create(id: CustomerId, name: string, email: Email): Customer {
        if (!name || name.trim() === "") {
            throw new Error("Customer name cannot be empty.");
        }
        return new Customer(id, name.trim(), email);
    }

    public getId(): CustomerId {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getEmail(): Email {
        return this.email;
    }

    public changeEmail(newEmail: Email): void {
        if (this.email.equals(newEmail)) {
            throw new Error("Cannot change email to the same value.");
        }
        
        this.email = newEmail;
    }
}