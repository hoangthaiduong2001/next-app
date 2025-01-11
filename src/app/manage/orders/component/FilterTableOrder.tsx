import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, getVietnameseOrderStatus } from "@/config/utils";
import { OrderStatusValues } from "@/constants/type";
import { Check, ChevronsUpDown } from "lucide-react";
import { filterValue } from "../const";
import { TFilterTableOrder } from "../type";

const FilterTableOrder = <T,>({
  table,
  openStatusFilter,
  setOpenStatusFilter,
}: TFilterTableOrder<T>) => {
  return (
    <div className="flex flex-wrap items-center gap-4 py-4">
      {filterValue.map((item) => (
        <Input
          key={item.id}
          placeholder={item.placeholder}
          value={
            (table.getColumn(item.value)?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn(item.value)?.setFilterValue(event.target.value)
          }
          className={`max-w-[${item.width}px]`}
        />
      ))}
      <Popover open={openStatusFilter} onOpenChange={setOpenStatusFilter}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openStatusFilter}
            className="w-[150px] text-sm justify-between"
          >
            {table.getColumn("status")?.getFilterValue()
              ? getVietnameseOrderStatus(
                  table
                    .getColumn("status")
                    ?.getFilterValue() as (typeof OrderStatusValues)[number]
                )
              : "Status"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandGroup>
              <CommandList>
                {OrderStatusValues.map((status) => (
                  <CommandItem
                    key={status}
                    value={status}
                    onSelect={(currentValue) => {
                      table
                        .getColumn("status")
                        ?.setFilterValue(
                          currentValue ===
                            table.getColumn("status")?.getFilterValue()
                            ? ""
                            : currentValue
                        );
                      setOpenStatusFilter(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        table.getColumn("status")?.getFilterValue() === status
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {getVietnameseOrderStatus(status)}
                  </CommandItem>
                ))}
              </CommandList>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default FilterTableOrder;
