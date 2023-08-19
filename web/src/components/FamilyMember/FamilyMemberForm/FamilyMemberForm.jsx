import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  CheckboxField,
  Submit,
} from '@redwoodjs/forms'

const FamilyMemberForm = (props) => {
  const onSubmit = (data) => {
    props.onSave(data, props?.familyMember?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="familyId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Family id
        </Label>

        <TextField
          name="familyId"
          defaultValue={props.familyMember?.familyId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="familyId" className="rw-field-error" />

        <Label
          name="userId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          User id
        </Label>

        <TextField
          name="userId"
          defaultValue={props.familyMember?.userId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="userId" className="rw-field-error" />

        <Label
          name="headOfHousehold"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Head of household
        </Label>

        <CheckboxField
          name="headOfHousehold"
          defaultChecked={props.familyMember?.headOfHousehold}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="headOfHousehold" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default FamilyMemberForm
