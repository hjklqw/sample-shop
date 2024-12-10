import { VariationFormProps } from '../models'

export default function CustomMessageVariantForm({
  data,
  updateVariation,
}: VariationFormProps) {
  return (
    <form>
      <label>
        <span>Name on decoration</span>
        <input
          type="text"
          placeholder="Your name or a receiver's name"
          onChange={(e) => updateVariation({ name: e.target.value })}
          maxLength={10}
          defaultValue={data?.name}
        />
      </label>
      <label>
        <span>A short message</span>
        <input
          type="text"
          placeholder="Max 100 characters"
          onChange={(e) => updateVariation({ message: e.target.value })}
          maxLength={100}
          defaultValue={data?.message}
        />
      </label>
    </form>
  )
}
