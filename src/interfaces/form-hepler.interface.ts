export interface IFormHelperOptions {
  updateValueAndValidity?: boolean;
  updateValidityOptions?: IUpdateValidityOptions;
  formStatus?: {
    markAsUntouched?: boolean;
    markAsTouched?: boolean;
    markAsDirty?: boolean;
    markAsPristine?: boolean;
  };
}

export interface IUpdateValidityOptions {
  emitEvent?: true;
  onlySelf?: false;
}
