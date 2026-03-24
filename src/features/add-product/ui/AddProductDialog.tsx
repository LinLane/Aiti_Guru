import { useId, useState, type ChangeEvent, type FormEvent } from 'react';

import { Button } from '../../../shared/ui/button';
import { Dialog } from '../../../shared/ui/dialog';
import { Input } from '../../../shared/ui/input';
import { useToast } from '../../../shared/ui/toast';
import styles from './AddProductDialog.module.css';
import type {
  AddProductDialogProps,
  AddProductFieldKey,
  AddProductFormState,
} from './addProductDialog.types';

const initialValues: AddProductFormState = {
  title: '',
  brand: '',
  sku: '',
  price: '',
};

const initialHighlight: Record<AddProductFieldKey, boolean> = {
  title: false,
  brand: false,
  sku: false,
  price: false,
};

export function AddProductDialog(props: AddProductDialogProps) {
  const { isOpen, onClose, onSubmit } = props;
  const { showToast } = useToast();
  const [values, setValues] = useState<AddProductFormState>(initialValues);
  const [highlightInvalid, setHighlightInvalid] =
    useState<Record<AddProductFieldKey, boolean>>(initialHighlight);
  const formId = useId();

  function handleRequestClose() {
    setValues(initialValues);
    setHighlightInvalid(initialHighlight);
    onClose();
  }

  function handleChange(field: AddProductFieldKey) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setValues((previous) => ({
        ...previous,
        [field]: event.target.value,
      }));

      setHighlightInvalid((previous) => ({
        ...previous,
        [field]: false,
      }));
    };
  }

  function validate(): boolean {
    const nextHighlight: Record<AddProductFieldKey, boolean> = {
      title: !values.title.trim(),
      brand: !values.brand.trim(),
      sku: !values.sku.trim(),
      price: !values.price.trim(),
    };

    const hasEmpty = Object.values(nextHighlight).some(Boolean);
    if (hasEmpty) {
      setHighlightInvalid(nextHighlight);
      showToast({
        variant: 'error',
        message: 'Заполните все обязательные поля',
      });
      return false;
    }

    const price = Number(values.price);

    if (Number.isNaN(price) || price < 0) {
      setHighlightInvalid({ ...initialHighlight, price: true });
      showToast({
        variant: 'error',
        message: 'Цена должна быть числом не меньше 0',
      });
      return false;
    }

    setHighlightInvalid(initialHighlight);
    return true;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    await onSubmit({
      title: values.title.trim(),
      brand: values.brand.trim(),
      sku: values.sku.trim(),
      price: Number(values.price),
    });

    setValues(initialValues);
    setHighlightInvalid(initialHighlight);
    onClose();
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleRequestClose}
      title="Добавить товар"
      description="Укажите наименование, вендора, артикул и цену."
      footer={
        <>
          <Button variant="secondary" onClick={handleRequestClose}>
            Отмена
          </Button>
          <Button type="submit" form={formId}>
            Добавить товар
          </Button>
        </>
      }
    >
      <form id={formId} className={styles.form} noValidate onSubmit={handleSubmit}>
        <div className={styles.grid}>
          <Input
            fullWidth
            label="Наименование"
            value={values.title}
            onChange={handleChange('title')}
            invalid={highlightInvalid.title}
            placeholder="Например, iPhone 17"
          />
          <Input
            fullWidth
            label="Вендор"
            value={values.brand}
            onChange={handleChange('brand')}
            invalid={highlightInvalid.brand}
            placeholder="Например, Apple"
          />
          <Input
            fullWidth
            label="Артикул"
            value={values.sku}
            onChange={handleChange('sku')}
            invalid={highlightInvalid.sku}
            placeholder="Например, IP17-001"
          />
          <Input
            fullWidth
            type="number"
            min="0"
            step="0.01"
            label="Цена"
            value={values.price}
            onChange={handleChange('price')}
            invalid={highlightInvalid.price}
            placeholder="0.00"
          />
        </div>
      </form>
    </Dialog>
  );
}

export default AddProductDialog;
