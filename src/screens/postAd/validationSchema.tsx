import * as Yup from 'yup';

export const postAdValidationSchema = Yup.object().shape({
  title: Yup.string().required('Title is mandatory').min(10).max(70),
  description: Yup.string()
    .required('Description is mandatory')
    .min(10)
    .max(4000),
  propertyTypeId: Yup.string().required('Type is mandatory')
    .typeError('Type is mandatory'),
  listingTypeId: Yup.string().required('Subtype is mandatory')
    .typeError('Subtype is mandatory'),
  price: Yup.number()
    .typeError('Price must be a number')
    .required('Price is required')
    .min(1, 'Price must be at least ₹1'),
  areaSize: Yup.number()
    .typeError('Area Size must be a number')
    .required('Area Size is required')
    .min(1, 'Area Size must be at least 1'),
  nearbyLandmarks: Yup.array().of(
    Yup.object({
      name: Yup.string().required('Name is required'),
      value: Yup.string().required('Value is required'),
      unit: Yup.string().required('Unit is required'),
    }),
  ),
  // imageUrls: Yup.array().required('Please upload aleast 1 Image'),
});
