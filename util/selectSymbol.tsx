import { useCallback, useEffect } from "react";

export function selectSymbol(
  perpetualSymbols: string[],
  selectedSymbol: string | null,
  setSelectedSymbol: any,
  formik: any,
  positions: any,
  setSelectedPosition: any,
  leverageBrackets: any,
  setSelectedLeverage: any
) {
  // useEffect(() => {
  //   if (perpetualSymbols.length > 0 && selectedSymbol === null) {
  //     let initialSymbol =
  //       localStorage.getItem("selectedSymbol") || perpetualSymbols[0];
  //     setSelectedSymbol(initialSymbol);
  //     formik.setFieldValue("symbol", initialSymbol);
  //   }
  // }, [perpetualSymbols, selectedSymbol, formik]);

  useEffect(() => {
    if (selectedSymbol && positions && positions.length > 0) {
      const foundPosition = positions.find(
        (position: any) => position.symbol === selectedSymbol
      );
      if (foundPosition) {
        setSelectedPosition(foundPosition.leverage);
        if (leverageBrackets) {
          const leverageBracket = leverageBrackets.find(
            (bracket: any) => bracket.symbol === selectedSymbol
          );
          if (leverageBracket) {
            setSelectedLeverage(leverageBracket.brackets[0].initialLeverage);
          }
        }
      }
    }
  }, [selectedSymbol, positions, leverageBrackets]);

  const handleSelect = useCallback(
    (symbol: string) => {
      localStorage.setItem("selectedSymbol", symbol);
      setSelectedSymbol(symbol);
      formik.setFieldValue("symbol", symbol);

      if (positions && leverageBrackets) {
        const foundPosition = positions.find(
          (position: any) => position.symbol === symbol
        );
        const leverageBracket = leverageBrackets.find(
          (bracket: any) => bracket.symbol === symbol
        );
        if (foundPosition) {
          setSelectedPosition(foundPosition.leverage);
        }
        if (leverageBracket) {
          setSelectedLeverage(leverageBracket.brackets[0].initialLeverage);
        }
      }
    },
    [positions, leverageBrackets, formik]
  );
  return handleSelect;
}

export default selectSymbol;
