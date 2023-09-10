import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  CheckboxField,
  Submit,
} from '@redwoodjs/forms'
import { useAuth } from 'src/auth'
const FamilyMemberForm = (props) => {
  const { currentUser } = useAuth()
  const onSubmit = (data) => {
    console.log({method: 'FamilyMemberForm.onSubmit', data})
    props.onSave(data)
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
          name="name"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Name
        </Label>

        <TextField
          name="name"
          placeholder={'Bart'}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="name" className="rw-field-error" />
<Label
          name="email"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Email
        </Label>

        <TextField
          name="email"
          placeholder={'email or name'}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: false }}
        />

        <FieldError name="email" className="rw-field-error" />
{/*
        <Label
          name="familyId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          familyId
        </Label>

        <TextField
          name="familyId"

          defaultValue={currentUser?.FamilyMember[0]?.Family.id}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="familyId" className="rw-field-error" />
*/}
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
