import {UserButton} from "@clerk/nextjs";
import React from "react";
import { ClerkProvider } from '@clerk/nextjs';

function DashboardHeader(){
    return(
        <div className='p-5  shadow-sm border-b flex justify-between'>
            <div></div>
            <div>
                <UserButton afterSignOutUrl= "/"/>
            </div>

        </div>
    )
}
export default DashboardHeader;