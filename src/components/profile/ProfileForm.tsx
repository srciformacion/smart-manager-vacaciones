
import React from "react";
import { FormField } from "./FormField";
import { DatePickerField } from "./DatePickerField";
import { FormActions } from "./FormActions";
import { ProfileFormProps } from "./types";

export const ProfileForm = ({
  form,
  edit,
  saving,
  createMode,
  onSave,
  onCancel,
  onEdit,
  onChange,
}: ProfileFormProps) => {
  const handleDateChange = (date: Date) => {
    onChange(date);
  };

  return (
    <>
      <div className="space-y-5">
        <FormField
          label="Nombre"
          name="name"
          value={form.name}
          onChange={onChange}
          disabled={!edit}
          required
        />
        <FormField
          label="Apellidos"
          name="surname"
          value={form.surname}
          onChange={onChange}
          disabled={!edit}
          required
        />
        <FormField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          disabled={true}
        />
        <FormField
          label="DNI"
          name="dni"
          value={form.dni}
          onChange={onChange}
          disabled={!edit}
          required
        />
        <FormField
          label="Departamento"
          name="department"
          value={form.department}
          onChange={onChange}
          disabled={!edit}
          required
        />
        <DatePickerField
          label="Fecha de inicio"
          value={form.start_date}
          onChange={handleDateChange}
          disabled={!edit}
        />
      </div>

      <FormActions
        edit={edit}
        saving={saving}
        createMode={createMode}
        onSave={onSave}
        onCancel={onCancel}
        onEdit={onEdit}
      />
    </>
  );
};
