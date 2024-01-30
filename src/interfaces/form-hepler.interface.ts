export interface IFormHelperOptions {
  updateValueAndValidity?: boolean;
  updateValidityOptions?: IUpdateValidityOptions;
  formStatus?: {
    markAsUntouched?: boolean;
    markAsTouched?: boolean;
    markAsDirty?: boolean;
    markAsPristine?: boolean;
  };
  resetValue?: Object | undefined;
}

export interface IUpdateValidityOptions {
  emitEvent?: true;
  onlySelf?: false;
}
