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
import { Button } from "@/components/ui/button"
import axios from "axios"

export default function Dashboard() {
  const user: any = useAppSelector(selectUser)
  const stripeCustomerId = useAppSelector(selectCustomer)
  const stripeSubscription = useAppSelector(selectSubscription)
  const [trialEnd, setTrialEnd] = useState(stripeSubscription?.data[0]?.trial_end)
  const [userData, setUserData] = useState<User>(user?.user)
  const dispatch = useAppDispatch();


  console.log('stripe customer id', stripeCustomerId?.id)
  console.log('stripe subscription', stripeSubscription?.data[0]?.trial_end)



  useEffect(() => {
    const handleFetchStripeCustomer = async () => {
      const response = await dispatch(fetchStripeCustomer(userData?.email)).catch((e) => { console.error(e) })
      console.log('response', response)
    }

    handleFetchStripeCustomer().catch((e) => { console.error(e) })
  }, [dispatch, stripeCustomerId?.id, userData?._id, userData?.email, userData?.stripeCustomerId, userData?.userId])


  const handleReactivate = async () => {
    const customerId = userData?.stripeCustomerId;
    const deleteAt = userData?.deletionScheduledAt;
    const response = await axios.post(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/stripe/reactivate-subscription`, { customerId, deleteAt })


    if (response.status === 200) {
      console.log('success')
      window.open(response.data.url, "_blank", "noopener noreferrer")
    }
  }
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
                  {userData?.subscriptionStatus === "trialing" ?
                    (<><BreadcrumbSeparator className="hidden md:block" /><BreadcrumbItem>
                      <BreadcrumbPage><AnimeCountdown trialEnd={trialEnd} /></BreadcrumbPage>
                    </BreadcrumbItem></>) : (<><BreadcrumbSeparator className="hidden md:block" /><BreadcrumbItem>
                      <BreadcrumbPage>Basic Plan</BreadcrumbPage>
                    </BreadcrumbItem></>)}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="absolute top-2 right-5">
              <ModeToggle />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {userData?.subscriptionStatus === "canceled" ? (<div className="flex flex-col p-4 m-4 gap-12">
              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Please re-activate your subscription to access features</h1>
              <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                If you do not re-activate your subscription by {new Date(userData?.deletionScheduledAt).toLocaleDateString()}, your data will be deleted.</h4>
              <Button onClick={() => handleReactivate().catch((e) => console.error(e))} style={{ cursor: "pointer" }}>re-activate my subscription</Button>
            </div>) : (<div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min">
              <LinkDataTable />
            </div>)}

          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
