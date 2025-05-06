
import { AnnualHours } from "@/types/calendar";
import { supabase } from "@/integrations/supabase/client";
import { isDemoUser, generateDemoAnnualHours } from "./demo-data";

// Function to fetch or create annual hours data
export const fetchAnnualHours = async (userId: string): Promise<AnnualHours | null> => {
  const year = new Date().getFullYear();
  
  // For demo users, return simulated data
  if (isDemoUser(userId)) {
    return generateDemoAnnualHours(userId);
  }
  
  try {
    // Fetch annual hours from Supabase
    const { data, error } = await supabase
      .from('annual_hours')
      .select('*')
      .eq('user_id', userId)
      .eq('year', year)
      .maybeSingle();
      
    if (error && error.code !== 'PGRST116') {
      console.error("Error fetching annual hours:", error);
    }
    
    // If data exists, return it in the expected format
    if (data) {
      return {
        userId: data.user_id,
        year: data.year,
        baseHours: data.base_hours,
        workedHours: data.worked_hours,
        vacationHours: data.vacation_hours,
        sickLeaveHours: data.sick_leave_hours,
        personalLeaveHours: data.personal_leave_hours,
        seniorityAdjustment: data.seniority_adjustment,
        remainingHours: data.remaining_hours,
      };
    } 
    
    // If no data exists, create a new record
    const defaultHours = {
      user_id: userId,
      year,
      base_hours: 1700,
      worked_hours: 0,
      vacation_hours: 0,
      sick_leave_hours: 0,
      personal_leave_hours: 0,
      seniority_adjustment: 0,
      remaining_hours: 1700
    };
    
    const { data: newHoursData, error: insertError } = await supabase
      .from('annual_hours')
      .insert(defaultHours)
      .select();
      
    if (insertError) {
      console.error("Error creating annual hours:", insertError);
      throw insertError;
    }
    
    if (newHoursData && newHoursData.length > 0) {
      return {
        userId,
        year,
        baseHours: 1700,
        workedHours: 0,
        vacationHours: 0,
        sickLeaveHours: 0,
        personalLeaveHours: 0,
        seniorityAdjustment: 0,
        remainingHours: 1700,
      };
    }
    
    throw new Error("Failed to create annual hours record");
    
  } catch (error) {
    console.error("Error in fetchAnnualHours:", error);
    
    // Return default data on error
    return generateDemoAnnualHours(userId);
  }
};

// Update worked hours in database
export const updateWorkedHours = async (userId: string, hours: number, annualHoursData: AnnualHours): Promise<any> => {
  if (!annualHoursData) return null;
  
  // For demo users, just return updated local state
  if (isDemoUser(userId)) {
    return {
      ...annualHoursData,
      workedHours: hours
    };
  }
  
  try {
    const { data, error } = await supabase
      .from('annual_hours')
      .update({ worked_hours: hours })
      .eq('user_id', userId)
      .eq('year', annualHoursData.year)
      .select();
      
    if (error) {
      console.error("Error updating worked hours:", error);
      return null;
    }
    
    return data[0];
  } catch (error) {
    console.error("Error in updateWorkedHours:", error);
    return null;
  }
};
