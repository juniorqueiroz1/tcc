import { ChangeEvent, useCallback, useState } from 'react';
import { SelectOption } from '../SelectInput';

interface Field {
  value: string;
  setValue: (value: string) => void;
  options: SelectOption[];
  setOptions: (options: SelectOption[]) => void;
  reset: () => void;
  handleChange: (event: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => void;
}

interface UseFieldOptions {
  dependant?: Field[];
  resolve?: (value: string) => void | Promise<void>;
}

function useField({ dependant = [], resolve }: UseFieldOptions): Field {
  const [value, setValue] = useState('');
  const [options, setOptions] = useState<SelectOption[]>([]);

  const reset = useCallback(() => {
    setValue('');
    setOptions([]);
  }, []);

  const handleChange = useCallback(
    async (event: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
      const inputValue = event.target.value;

      setValue(inputValue);

      dependant.forEach(field => field.reset());

      if (inputValue && resolve) {
        await Promise.resolve(resolve(inputValue));
      }
    },
    [dependant, resolve],
  );

  return { value, setValue, options, setOptions, reset, handleChange };
}

export { useField };

