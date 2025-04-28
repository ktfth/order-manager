export class Quantity {
    private readonly value: number;

    private constructor(value: number) {
        this.value = value;
    }

    public static create(value: number): Quantity {
        if (!Number.isInteger(value)) {
            throw new Error('Quantity must be an integer');
        }
        
        if (value <= 0) {
            throw new Error('Quantity must be greater than zero');
        }

        return new Quantity(value);
    }

    public getValue(): number {
        return this.value;
    }
}