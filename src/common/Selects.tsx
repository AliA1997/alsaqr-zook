import { TAG_OPTIONS } from "@utils/tagOptions";
import { FieldHookConfig, useField } from "formik";
import { useCallback, useMemo, useState } from "react";
import { GenericOption, Option } from '@typings'
import { XIcon } from "@heroicons/react/solid";

type MWMultiSelectFieldOfFocusProps = {
    noOptionsText: string;
    placeholder: string;
    label?: string;
    className?: string;
    disabled?: boolean;
    maxSelections?: number;
} & FieldHookConfig<string[]>;

export function AlSaqrMultiSelect({
    noOptionsText,
    placeholder,
    disabled,
    label,
    maxSelections = 5,
    ...props
}: MWMultiSelectFieldOfFocusProps) {
    const [field, meta, helpers] = useField<string[]>(props);
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [filteredOptions, setFilteredOptions] = useState<Option[]>(TAG_OPTIONS);

    const handleChangeSearchTerm = (searchTermVal: string) => {
        setSearchTerm(searchTermVal);
        const updatedFilteredValues = TAG_OPTIONS.filter(option => {
            return (
                option.value?.toLowerCase().includes(searchTermVal.toLowerCase()) &&
                option.label?.toLowerCase().includes(searchTermVal.toLowerCase())
            );
        });
        setFilteredOptions(updatedFilteredValues);
    };

    const toggleSelection = (value: string) => {
        const newValue = field.value.includes(value)
            ? field.value.filter(v => v !== value)
            : field.value.length < maxSelections
                ? [...field.value, value]
                : field.value;

        helpers.setValue(newValue);
    };

    const removeSelection = (value: string) => {
        helpers.setValue(field.value.filter(v => v !== value));
    };

    const closeDropdown = useCallback(() => setTimeout(() => setIsOpen(false), 200), []);

    return (
        <div className="flex flex-col mb-5 w-full z-[10]">
            <div className={`
                absolute z-[0] ${isOpen ? 'h-[15rem]' : 'h-[7rem]'} w-[60rem]
                `} onClick={() => closeDropdown()}></div>

            {label && (
                <label
                    aria-label={label}
                    htmlFor={field.name}
                    className="mb-1 block text-sm font-medium text-gray-700 z-[10]"
                >
                    {label} {maxSelections && `(Max ${maxSelections})`}
                </label>
            )}

            {/* Selected items display */}
            <div className="flex flex-wrap gap-2 mb-2 max-h-16 overflow-y-auto z-[10]">
                {field.value.map(value => {
                    const option = TAG_OPTIONS.find(o => o.value === value);
                    return (
                        <div
                            key={value}
                            className="flex items-center rounded px-2 py-1 text-sm border border-[#55a8c2] text-[#55a8c2]"
                        >
                            {option?.label || value}
                            <button
                                type="button"
                                onClick={() => removeSelection(value)}
                                aria-label={`Remove ${option?.label || value}`}
                                className={`
                                    ml-2 text-xs hover:text-gray-500 bg-transparent
                                    border-none shadow-none
                                    outline-none focus:outline-none focus:ring-0
                                    appearance-none
                                `}
                            >
                                <XIcon className='h-4 w-4' />
                            </button>
                        </div>

                    );
                })}
            </div>

            {/* Multi-select dropdown */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search fields of focus..."
                    className="w-full p-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={e => handleChangeSearchTerm(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={e => {
                        if (e.key === 'Escape') closeDropdown();
                    }}
                />

                {isOpen && (
                    <div className="absolute top-0 right-0 mt-0 flex h-[2.3rem] w-full justify-end z-50">
                        <button
                            type="button"
                            onClick={() => {
                                setSearchTerm('');
                                setFilteredOptions(TAG_OPTIONS);
                                closeDropdown();
                            }}
                            className="
                                p-1
                                text-gray-900 hover:text-[#55a8c2]
                                bg-transparent hover:bg-transparent
                                border-none shadow-none
                                outline-none focus:outline-none focus:ring-0
                                appearance-none
                            "
                            style={{ background: 'transparent' }}
                        >
                            <XIcon className="h-5 w-5" />
                        </button>
                    </div>
                )}

                {isOpen && (
                    <div className="absolute w-full bg-white border mt-1 h-72 overflow-y-auto z-40 rounded shadow">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <div key={option.label} className="text-sm">
                                    <div
                                        key={option.value}
                                        className={`p-2 cursor-pointer flex items-center 
                                            ${field.value.includes(option.label) ? 'text-[#55a8c2]' : 'hover:bg-gray-100'}`}
                                        onClick={e => {
                                            e.stopPropagation();
                                            toggleSelection(option.label);
                                        }}
                                        onFocus={e => e.stopPropagation()}
                                        onBlur={e => e.stopPropagation()}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={field.value.includes(option.label)}
                                            readOnly
                                            className="mr-2 accent-[#55a8c2] text-gray-100"
                                        />
                                        {option.label}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-2 text-gray-500">{noOptionsText}</div>
                        )}
                    </div>
                )}
            </div>

            {meta.touched && meta.error && (
                <p className="text-red-600 text-xs mt-1">{meta.error}</p>
            )}
        </div>
    );
}

type AlSaqrSelectProps<ValueType> = {
    label: string;
    name: string;
    options: GenericOption<ValueType>[];
    placeholder?: string;
}

export function AlSaqrSelect<ValueType>({
  name,
  options,
  placeholder
}: AlSaqrSelectProps<ValueType>) {
  const [field, meta, helpers] = useField<ValueType>(name);
  const [showCountrySelect, setShowCountrySelect] = useState(false);

  const toggleOpen = (e?: React.MouseEvent) => {
    e?.preventDefault();
    setShowCountrySelect(prev => !prev);
  };

  const selectedOption = useMemo(() => options.find(pc => pc.value === field.value), [field.value]);

  return (
    <div className="relative mb-2">
      <button
        type="button"
        onClick={toggleOpen}
        className={`mt-1 w-full rounded border px-3 py-2 text-left text-sm transition
          ${meta.error ? 'border-red-500' : 'border-gray-800'}
          bg-white text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500`}
      >
        <span className="block w-full truncate flex justify-between">
          {selectedOption?.label ?? placeholder ?? 'Select Country Of Origin'} 
          <span>▼</span>
        </span>
      </button>

      {meta.error && (
        <p className="absolute mt-1 text-xs text-red-600">{meta.error}</p>
      )}

      {showCountrySelect && (
        <div
          id="nationalIdCountry"
          className="absolute mt-1 max-h-40 w-full overflow-y-auto rounded border bg-white text-sm z-50 shadow"
          role="listbox"
          aria-labelledby={field.name}
        >
          {options.map((option, idx) => (
            <div
              key={idx}
              className="cursor-pointer px-3 py-2 hover:bg-gray-100"
              onClick={() => {
                helpers.setValue(option.value);
                setShowCountrySelect(false);
              }}
              onDoubleClick={() => {
                setShowCountrySelect(false);
              }}
              role="option"
              aria-selected={field.value === option.value}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}