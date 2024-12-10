import { VariationFormProps } from '../models'

export default function CustomImageVariantForm({
  data,
  updateVariation,
}: VariationFormProps) {
  return (
    <form>
      <label>
        <span>Placement</span>
        <input
          type="text"
          placeholder="Large in the center, small top left, etc."
          onChange={(e) => updateVariation({ placement: e.target.value })}
          maxLength={100}
          defaultValue={data?.placement}
        />
      </label>
      <label>
        <span>A link to the image</span>
        <input
          type="text"
          placeholder="Please enter a public URL"
          onChange={(e) => updateVariation({ imageLink: e.target.value })}
          maxLength={200}
          defaultValue={data?.imageLink}
        />
      </label>
    </form>
  )
}
