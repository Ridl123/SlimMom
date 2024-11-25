import { IoClose } from "react-icons/io5";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMeals } from "../REDUX/meals/operations";
import { selectIngredientsList } from "../REDUX/ingredients/selectors";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const MobileModal = ({ date, onClick }) => {
  // Initializing the Redux dispatch function for triggering actions.
  const dispatch = useDispatch();

  // Initializing state variables for managing the query and filtered ingredients list.
  const [query, setQuery] = useState("");
  const [filteredIngredients, setFilteredIngredients] = useState([]);

  // Selecting the ingredients list from the Redux store.
  const ingredients = useSelector(selectIngredientsList);

  // Defining the validation schema for the form using Yup.
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    grams: Yup.number().required("Weight is required"),
  });

  // Formatting the date into a DD.MM.YYYY string.
  const formatDate = (date) => {
    if (!date) return null;

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  };

  // Handling changes in the input field and filtering ingredients based on the query.
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    const filtered = ingredients.filter((item) =>
      item.title.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredIngredients(filtered.slice(0, 10));
  };

  return (
    // Creating a modal container with specific styling for mobile devices.
    <div className="w-full h-full tablet:h-full phone:h-full bg-white absolute top-[68px] phone:top-[62px] right-0 left-0 z-10 flex flex-col pt-16 gap-6 px-4">
      {/* Adding a close icon for dismissing the modal. */}
      <IoClose
        onClick={onClick}
        className="absolute top-3 right-3 w-6 h-6 text-slate-400"
      />
      <Formik
        initialValues={{
          name: "",
          grams: "",
          calories: "",
          date: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          const formattedDate = date ? formatDate(date) : null;

          // Filtering the selected ingredient and calculating calories based on grams.
          const filteredCalories = ingredients.filter(
            (item) => item.title === values.name
          );
          const calories = (filteredCalories[0].calories * values.grams) / 100;

          // Preparing the values to be submitted to Redux.
          const submitValues = {
            product: values.name,
            weight: values.grams,
            calories: calories.toFixed(0),
            date: formattedDate,
          };

          dispatch(addMeals(submitValues));
          setQuery("");
          resetForm();
        }}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form className="flex flex-col">
            <div className="flex flex-col gap-8">
              {/* Adding an input field for the product name with filtering functionality. */}
              <div className="relative">
                <Field
                  value={query}
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  id="name"
                  name="name"
                  type="string"
                  placeholder="Enter product name"
                  className="w-full bg-transparent border-b-2 outline-none pb-2 text-slate-400 font-bold focus:text-slate-600 focus:border-slate-600 placeholder:focus:text-slate-600 hover:text-slate-600 hover:border-slate-600"
                />
                {/* Displaying error messages for the name field. */}
                <ErrorMessage
                  name="name"
                  component="div"
                  className="absolute text-red-500"
                />
                {filteredIngredients.length > 0 && (
                  // Displaying a dropdown of filtered ingredients.
                  <ul className="absolute bg-white shadow-md rounded-lg mt-2 w-60 max-h-40 overflow-y-auto z-10">
                    {filteredIngredients.map((item) => (
                      <li
                        key={item._id}
                        className="px-4 py-2 hover:bg-slate-100 cursor-pointer"
                        onClick={() => {
                          setQuery(item.title);
                          setFieldValue("name", item.title);
                          setFilteredIngredients([]);
                        }}
                      >
                        {item.title}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {/* Adding an input field for the weight in grams. */}
              <div className="relative">
                <Field
                  id="grams"
                  name="grams"
                  type="number"
                  placeholder="Grams"
                  className="w-full bg-transparent border-b-2 outline-none pb-2 text-slate-400 font-bold focus:text-slate-600 focus:border-slate-600 placeholder:focus:text-slate-600 hover:text-slate-600 hover:border-slate-600"
                />
                {/* Displaying error messages for the grams field. */}
                <ErrorMessage
                  name="grams"
                  component="div"
                  className="absolute text-red-500"
                />
              </div>
              {/* Adding a submit button for adding the meal. */}
              <button
                disabled={isSubmitting}
                type="submit"
                className="bg-orange-500 text-white px-20 py-3 rounded-full hover:bg-orange-600 hover:scale-105 transition-all duration-300 flex justify-center items-center"
              >
                Add
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default MobileModal;