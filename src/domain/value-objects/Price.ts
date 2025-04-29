export class Price {
    private readonly value: number;

    private constructor(value: number) {
        this.value = value;
    }

    public static create(value: number): Price {
        if (typeof value !== 'number') {
            throw new Error('Price must be a number');
        }

        if (Number.isNaN(value)) {
            throw new Error('Price must be a valid number');
        }

        if (!Number.isFinite(value)) {
            throw new Error('Price must be a finite number');
        }

        if (value <= 0) {
            throw new Error('Price must be greater than zero');
        }

        return new Price(value);
    }

    public getValue(): number {
        return this.value;
    }
}