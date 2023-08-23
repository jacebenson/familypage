import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import SetFamily from 'src/components/SetFamily/SetFamily'

const SetupFamilyPage = () => {
  return (
    <>
      <MetaTags title="SetupFamily" description="SetupFamily page" />
      <SetFamily />
    </>
  )
}

export default SetupFamilyPage
