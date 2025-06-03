
import { useState, useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User } from "@/types";
import { UseFormReturn } from "react-hook-form";
import { RequestFormValues } from "./request-form-schema";
import { supabase } from "@/integrations/supabase/client";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReplacementSearchSectionProps {
  form: UseFormReturn<RequestFormValues>;
  user: User;
  isSubmitting?: boolean;
}

export function ReplacementSearchSection({ form, user, isSubmitting }: ReplacementSearchSectionProps) {
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const searchCoworkers = async () => {
      if (searchTerm.length < 2) {
        setSearchResults([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .neq('id', user.id)
          .ilike('name', `%${searchTerm}%`)
          .limit(10);

        if (error) throw error;

        if (data && data.length > 0) {
          const mappedCoworkers: User[] = data.map(profile => ({
            id: profile.id,
            name: profile.name || '',
            email: profile.email || '',
            role: 'worker',
            department: profile.department || '',
            shift: 'Programado',
            workGroup: 'Grupo Programado',
            workday: 'Completa',
            seniority: 1
          }));
          
          setSearchResults(mappedCoworkers.filter(u => u.department === user.department));
        }
      } catch (error) {
        console.error("Error al buscar compañeros:", error);
        setSearchResults([]);
      }
    };

    const debounceTimer = setTimeout(searchCoworkers, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, user.id, user.department]);

  const handleSelectUser = (selectedUser: User) => {
    setSelectedUser(selectedUser);
    form.setValue("replacementUserId", selectedUser.id);
    form.setValue("replacementUserName", selectedUser.name);
    setOpen(false);
  };

  return (
    <FormField
      control={form.control}
      name="replacementUserName"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Compañero de reemplazo</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                  disabled={isSubmitting}
                >
                  {selectedUser ? selectedUser.name : "Buscar compañero..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput 
                  placeholder="Escriba el nombre del compañero..." 
                  value={searchTerm}
                  onValueChange={setSearchTerm}
                />
                <CommandList>
                  <CommandEmpty>
                    {searchTerm.length < 2 
                      ? "Escriba al menos 2 caracteres para buscar" 
                      : "No se encontraron compañeros"}
                  </CommandEmpty>
                  <CommandGroup>
                    {searchResults.map((coworker) => (
                      <CommandItem
                        key={coworker.id}
                        value={coworker.id}
                        onSelect={() => handleSelectUser(coworker)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedUser?.id === coworker.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {coworker.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormDescription>
            Busque y seleccione el compañero con quien desea intercambiar el turno
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
