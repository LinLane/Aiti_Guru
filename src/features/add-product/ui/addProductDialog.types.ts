export interface AddProductFormValues {
  title: string;
  brand: string;
  sku: string;
  price: number;
}

export interface AddProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: AddProductFormValues) => void | Promise<void>;
}

export interface AddProductFormState {
  title: string;
  brand: string;
  sku: string;
  price: string;
}

export type AddProductFieldKey = keyof AddProductFormState;
