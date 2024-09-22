"use client";

import { useState } from "react";
import {
  decrement,
  increment,
  incrementAsync,
  incrementByAmount,
  incrementIfOdd,
  selectCount,
  selectStatus,
} from "@/redux/slices/counterSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Button } from "@/components/atoms/Button";
import { toast } from "sonner";
import { FileUploader } from "@/components/molecules/FileUploader";

const Dashbaord = () => {
  const dispatch = useAppDispatch();
  const count = useAppSelector(selectCount);
  const status = useAppSelector(selectStatus);
  const [incrementAmount, setIncrementAmount] = useState("2");

  const incrementValue = Number(incrementAmount) || 0;

  return (
    <div>
      <div className='flex flex-row justify-center align-middle mb-3'>
        <Button
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          -
        </Button>
        <span aria-label="Count" className="pl-4 pr-4 mt-1 text-base">
          {count}
        </span>
        <Button
          aria-label="Increment value"
          onClick={() => {
            toast("this is sample toast");
            dispatch(increment())}
          }
        >
          +
        </Button>
      </div>
      <div className="flex flex-row justify-center align-middle gap-5">
        <input
          className="text-lg w-16 text-center mr-1 p-1"
          aria-label="Set increment amount"
          value={incrementAmount}
          type="number"
          onChange={(e) => {
            setIncrementAmount(e.target.value);
          }}
        />
        <Button
          onClick={() => dispatch(incrementByAmount(incrementValue))}
        >
          Add Amount
        </Button>
        <Button
          disabled={status !== "idle"}
          onClick={() => dispatch(incrementAsync(incrementValue))}
        >
          Add Async
        </Button>
        <Button
          onClick={() => {
            dispatch(incrementIfOdd(incrementValue));
          }}
        >
          Add If Odd
        </Button>
      </div>
      <FileUploader />
    </div>
  );
};

export default Dashbaord;