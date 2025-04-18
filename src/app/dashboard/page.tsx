"use client"

import { AppSidebar } from "@/components/app-sidebar"
import React, { useState, useEffect } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { LinkDataTable } from "@/components/link-table"
import { ModeToggle } from "@/components/themeToggle"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchStripeCustomer, selectUser, User, selectCustomer, selectSubscription } from "@/store/slices/userSlice"
import AnimeCountdown from '@/components/anime-countdown';
import axios from "axios"

export default function Dashboard() {
  const user: any = useAppSelector(selectUser)
  const stripeCustomerId = useAppSelector(selectCustomer)
  const stripeSubscription = useAppSelector(selectSubscription)
  const [trialEnd, setTrialEnd] = useState(stripeSubscription.data[0]?.trial_end)
  const [userData, setUserData] = useState<User>(user?.user)
  const dispatch = useAppDispatch();


  console.log('stripe customer id', stripeCustomerId.id)
  console.log('stripe subscription', stripeSubscription.data[0].trial_end)


  useEffect(() => {
    const handleFetchStripeCustomer = async () => {
      const response = await dispatch(fetchStripeCustomer(userData?.email)).catch((e) => { console.error(e) })
      console.log('response', response)
    }

    const handleUpdateStripeCustomerId = async () => {
      try {
        if (userData._id && !userData.stripeCustomerId) {
          const response = await axios.post(`/api/users`, { userId: userData?.userId, stripeCustomerId: stripeCustomerId?.id, type: "update" })
          console.log('response', response);
          if (response.status === 200) {
            console.log('response', response.data)
          }
        }
      } catch (e) {
        console.error(e)
      }
    }

    handleFetchStripeCustomer().catch((e) => { console.error(e) })
    handleUpdateStripeCustomerId().catch((e) => { console.error(e) })
  }, [dispatch, stripeCustomerId?.id, userData._id, userData?.email, userData.stripeCustomerId, userData?.userId])
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">Links</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Create a new Link</BreadcrumbPage>
                  </BreadcrumbItem>
                  {stripeSubscription.data[0].status === "trialing" ?
                    <><BreadcrumbSeparator className="hidden md:block" /><BreadcrumbItem>
                      <BreadcrumbPage><AnimeCountdown trialEnd={trialEnd} /></BreadcrumbPage>
                    </BreadcrumbItem></> : null}
                    {stripeSubscription.data[0].status === "active" ? 
                      <><BreadcrumbSeparator className="hidden md:block" /><BreadcrumbItem>
                      <BreadcrumbPage>Basic Plan</BreadcrumbPage>
                    </BreadcrumbItem></> : null}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="absolute top-2 right-5">
              <ModeToggle />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min">
              <LinkDataTable />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

function useAppKitAccount(): { caipAddress: any } {
  throw new Error("Function not implemented.")
}
