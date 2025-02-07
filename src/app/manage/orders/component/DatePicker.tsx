import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { initFromDate, initToDate } from "../const";
import { TDatePicker } from "../type";

const DatePicker = ({
  fromDate,
  toDate,
  setFromDate,
  setToDate,
}: TDatePicker) => {
  const resetDateFilter = () => {
    setFromDate(initFromDate);
    setToDate(initToDate);
  };
  return (
    <div className=" flex items-center">
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center">
          <span className="mr-2">From</span>
          <Input
            type="datetime-local"
            placeholder="From date"
            className="text-sm"
            value={format(fromDate, "yyyy-MM-dd HH:mm").replace(" ", "T")}
            onChange={(event) => {
              const selectedDate = new Date(event.target.value);
              setFromDate(selectedDate);
              event.target.hidden = true;
            }}
          />
        </div>
        <div className="flex items-center">
          <span className="mr-2">To</span>
          <Input
            type="datetime-local"
            placeholder="To date"
            value={format(toDate, "yyyy-MM-dd HH:mm").replace(" ", "T")}
            onChange={(event) => {
              const selectedDate = new Date(event.target.value);
              setToDate(new Date(selectedDate));
              event.target.hidden = true;
            }}
          />
        </div>
        <Button className="" variant={"outline"} onClick={resetDateFilter}>
          Reset
        </Button>
      </div>
    </div>
  );
};

export default DatePicker;
