export class Email {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(value: string): Email {
        if (!value.includes('@')) {
            throw new Error('Invalid email address');
        }
        return new Email(value);
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: Email): boolean {
        return this.value === other.value;
    }
}