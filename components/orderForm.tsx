import { useEffect, useState } from "react";
import { useFormik, Field, ErrorMessage } from "formik";
import { OpenOrder } from "@/components/buttonOpenOrder";
import { useOpenOrder } from "@/app/hooks/useOpenOrder";
import * as Yup from "yup";

// Yup schema za validaciju forme
const validationSchema = Yup.object().shape({
  selectedSymbol: Yup.string().required("Required"),
  quantity: Yup.number()
    .positive("Must be a positive number")
    .moreThan(0, "Minimum quantity is 0.0001 BTC"),
});

export const OrderForm = ({
  perpetualSymbols,
}: {
  perpetualSymbols: string[];
}) => {
  const openMarkOrderMutation = useOpenOrder();

  const [hasStartedTyping, setHasStartedTyping] = useState(false);
  const [hasClickedBuy, setHasClickedBuy] = useState(false);
  const [hasLostFocus, setHasLostFocus] = useState(false);

  const formik = useFormik({
    initialValues: {
      selectedSymbol: "",
      quantity: "",
    },
    validationSchema,
    validateOnMount: false,
    validateOnChange: hasStartedTyping,
    onSubmit: (values, { setSubmitting }) => {
      setHasClickedBuy(true);
      if (values.quantity === "") {
        setHasStartedTyping(true);
        formik.setFieldTouched("quantity", true, false);
      } else if (parseFloat(values.quantity) > 0) {
        openMarkOrderMutation.mutate({
          symbol: values.selectedSymbol,
          quantity: parseFloat(values.quantity),
        });
        formik.resetForm();
        setHasClickedBuy(false);
        setHasStartedTyping(false);
        setHasLostFocus(false);
      }
      setSubmitting(false);
    },
  });

  useEffect(() => {
    if (perpetualSymbols.length > 0) {
      formik.setFieldValue("selectedSymbol", perpetualSymbols[0]);
    }
  }, [perpetualSymbols]);

  useEffect(() => {
    if (formik.values.quantity !== "" && hasStartedTyping) {
      formik.setFieldTouched("quantity", true);
    }
  }, [formik.values.quantity, hasStartedTyping]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <label className="block">
        Select a symbol:
        <select
          className="block"
          name="selectedSymbol"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.selectedSymbol}
        >
          {perpetualSymbols.map((symbol: string) => (
            <option value={symbol} key={symbol}>
              {symbol}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span
          className={`block ${
            formik.touched.quantity && formik.errors.quantity ? "text-red" : ""
          }`}
        >
          {formik.touched.quantity && formik.errors.quantity
            ? formik.errors.quantity
            : "Enter quantity:"}
        </span>
      </label>
      <div
        onClick={() => {
          if (hasStartedTyping) {
            formik.setFieldTouched("quantity");
          }
        }}
        className={`quantity-field my-2 bg-gray-middle items-center relative h-10 text-sm inline-flex box-border rounded ${
          (formik.values.quantity === "" && hasClickedBuy) ||
          (parseFloat(formik.values.quantity) === 0 && formik.touched.quantity)
            ? "border-red border-[1px]"
            : formik.touched.quantity ||
              (hasLostFocus && formik.errors.quantity)
            ? "border-yellow border-[1px]"
            : ""
        }`}
      >
        <div>
          <label className="flex flex-shrink-0 ml-2">Size</label>
        </div>
        <input
          className="h-10 px-1 py-0 m-0 text-right text-sm bg-gray-middle/0 border-0 focus:border-0 focus:ring-0"
          type="number"
          name="quantity"
          onChange={(e) => {
            if (e.target.value !== "" && !hasStartedTyping) {
              setHasStartedTyping(true);
            }
            formik.handleChange(e);
          }}
          onBlur={() => {
            formik.handleBlur("quantity");
            if (!formik.errors.quantity) {
              formik.setFieldTouched("quantity", false, false);
              setHasLostFocus(true);
            }
          }}
          onFocus={() => {
            if (!formik.touched.quantity) {
              formik.setFieldTouched("quantity", true, false);
            }
          }}
          onKeyDown={(e) => e.key === "-" && e.preventDefault()}
          value={formik.values.quantity === "" ? "" : formik.values.quantity}
        />
        <div>
          <label className="text-gray-lighter font-medium flex flex-shrink-0 mr-2">
            BTC
          </label>
        </div>
      </div>
      <OpenOrder
        isFormValid={formik.isValid && formik.dirty}
        isSubmitting={formik.isSubmitting}
      />
    </form>
  );
};
