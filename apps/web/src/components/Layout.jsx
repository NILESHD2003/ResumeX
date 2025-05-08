import React from 'react'

import { FileUser, 
         FileTerminal, 
         Settings, 
         LogOut  
} from "lucide-react"

// importing sidebar components
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"

import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar"

function Layout() {
// Menu items.
const items = [
  {
    title: "Resume Templates",
    url: "#",
    icon: FileTerminal,
  },
  {
    title: "Cover Letter",
    url: "#",
    icon: FileUser,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings ,
  },
  
]
  return (
    <div>

   <SidebarProvider>
   <Sidebar>
    {/* <SidebarTrigger/>  */}
      <SidebarContent>
        <SidebarGroup>
          
          <SidebarGroupLabel 
            className='text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#CA79FF] to-[#1C7EFF] mt-3 mb-4 mr-6'
            >
              ResumeX
          </SidebarGroupLabel>
          <hr className='bg-gray-600' />
          
          <SidebarGroupContent>
            <SidebarMenu className='mt-4'>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className=' hover:bg-violet-100'>
                    <a href={item.url}>
                      <item.icon className=' text-gray-600'/>
                      <span className=' text-lg font-medium text-gray-400'>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-2">
          <hr className="h-px w-full bg-gray-600 mb-4" />
          <div className="flex items-center space-x-2 text-gray-600 font-medium">
            <LogOut className="w-5 h-5" />
            <p>Logout</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
   </SidebarProvider>
       
            
    </div>
  )
}

export default Layout
