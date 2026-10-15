<script setup lang="ts">
import { usePreviewI18n } from '../../i18n'

import { computed } from 'vue'
import { blocks } from 'shadcn-uniapp'
import GallerySection from './GallerySection.vue'
import ProfileCard from '../../blocks/profile-card/ProfileCard.vue'
import SettingsForm from '../../blocks/settings-form/SettingsForm.vue'
import FilterList from '../../blocks/filter-list/FilterList.vue'
import LoginForm from '../../blocks/login-form/LoginForm.vue'
import NotificationSettings from '../../blocks/notification-settings/NotificationSettings.vue'
import TeamMembers from '../../blocks/team-members/TeamMembers.vue'
import ShoppingCart from '../../blocks/shopping-cart/ShoppingCart.vue'
import OrderStatus from '../../blocks/order-status/OrderStatus.vue'
import BookingForm from '../../blocks/booking-form/BookingForm.vue'
import FeedbackForm from '../../blocks/feedback-form/FeedbackForm.vue'
import ProjectTasks from '../../blocks/project-tasks/ProjectTasks.vue'
import StatsCard from '../../blocks/stats-card/StatsCard.vue'
import QuickActions from '../../blocks/quick-actions/QuickActions.vue'
import AnnouncementFeed from '../../blocks/announcement-feed/AnnouncementFeed.vue'
import EventAgenda from '../../blocks/event-agenda/EventAgenda.vue'
import StudentSwitcher from '../../blocks/student-switcher/StudentSwitcher.vue'
import ApplicationProgress from '../../blocks/application-progress/ApplicationProgress.vue'
import ServiceInbox from '../../blocks/service-inbox/ServiceInbox.vue'
import SurveyCard from '../../blocks/survey-card/SurveyCard.vue'
import DocumentList from '../../blocks/document-list/DocumentList.vue'

const { t } = usePreviewI18n()
const props = defineProps<{ block: string }>()
const emit = defineEmits<{ notice: [message: string] }>()
const item = computed(() => blocks.find((block) => block.name === props.block))
const projects = [
  { id: 'studio', title: 'Studio website', description: 'A home for your latest work' },
  { id: 'system', title: 'Design system', description: 'One language, every interface' },
  { id: 'mobile', title: 'Mobile app', description: 'Your next idea, on the go' },
]
const members = [
  { id: 'alex', name: 'Alex Morgan', initials: 'AM', role: 'Design lead' },
  { id: 'sam', name: 'Sam Wilson', initials: 'SW', role: 'Developer' },
  { id: 'jordan', name: 'Jordan Lee', initials: 'JL', role: 'Product designer' },
]
const tasks = [
  { id: 'tokens', label: 'Define design tokens' },
  { id: 'components', label: 'Build core components' },
  { id: 'review', label: 'Review accessibility' },
  { id: 'launch', label: 'Publish the release' },
]
const dates = {
  min: new Date(2026, 9, 1).getTime(),
  max: new Date(2026, 9, 31).getTime(),
  selected: new Date(2026, 9, 15).getTime(),
}
const delivery = [
  { title: 'Order confirmed', description: 'Oct 12, 9:41 AM' },
  { title: 'Packed with care', description: 'Oct 13, 2:15 PM' },
  { title: 'Out for delivery', description: 'Your package is almost there' },
  { title: 'Delivered' },
]
const actions = [
  { id: 'calendar', title: 'Calendar', icon: 'calendar-line' },
  { id: 'documents', title: 'Documents', icon: 'file' },
  { id: 'messages', title: 'Messages', icon: 'email' },
  { id: 'surveys', title: 'Surveys', icon: 'edit' },
  { id: 'profile', title: 'My profile', icon: 'user' },
  { id: 'services', title: 'Services', icon: 'apps' },
]
const announcements = [
  {
    id: 'community',
    title: 'Community updates',
    items: [
      {
        id: 'news-1',
        title: 'A new term, a fresh start',
        date: 'Oct 15 · Community',
        unread: true,
      },
      { id: 'news-2', title: 'Meet your new activity leaders', date: 'Oct 12 · People' },
    ],
  },
  {
    id: 'learning',
    title: 'Learning & discovery',
    items: [{ id: 'news-3', title: 'A week of creative exploration', date: 'Oct 10 · Learning' }],
  },
]
const events = [
  {
    id: 'open-day',
    day: '24',
    month: 'OCT',
    title: 'Campus open day',
    time: '10:00 AM',
    location: 'Main campus',
    category: 'Community',
  },
  {
    id: 'studio',
    day: '28',
    month: 'OCT',
    title: 'Creative studio workshop',
    time: '2:00 PM',
    location: 'Design studio',
    category: 'Learning',
  },
]
const students = [
  { id: 'alex', name: 'Alex Taylor', initials: 'AT', grade: 'Grade 5', campus: 'North campus' },
  { id: 'jamie', name: 'Jamie Taylor', initials: 'JT', grade: 'Grade 2', campus: 'South campus' },
]
const application = [
  { title: 'Application received', description: 'Your details are complete' },
  { title: 'Documents reviewed', description: 'All required files are ready' },
  { title: 'Choose a visit', description: 'Pick the time that works for you' },
  { title: 'Next steps', description: 'Your admissions team will be in touch' },
]
const messages = [
  {
    id: 'visit',
    category: 'Admissions',
    title: 'Your campus visit is confirmed',
    description: 'We look forward to welcoming you on October 24.',
    date: 'Oct 15',
    read: false,
  },
  {
    id: 'form',
    category: 'Action needed',
    title: 'A quick update to your details',
    description: 'Please review your contact preferences.',
    date: 'Oct 14',
    read: true,
  },
]
const documents: {
  id: string
  title: string
  description: string
  status: 'ready' | 'pending' | 'review'
}[] = [
  {
    id: 'handbook',
    title: 'Family handbook',
    description: 'PDF · Updated October 2026',
    status: 'ready',
  },
  {
    id: 'application',
    title: 'Application details',
    description: 'Submitted for review',
    status: 'review',
  },
  {
    id: 'consent',
    title: 'Activity consent',
    description: 'Please complete before October 24',
    status: 'pending',
  },
]
function notice(message: string) {
  emit('notice', t(message))
}
</script>
<template>
  <GallerySection v-if="item" :title="t(item.title)" :description="t(item.description)">
    <ProfileCard
      v-if="block === 'profile-card'"
      name="Bryce"
      :description="t('Design & Development')"
      @edit="notice('Profile editing is ready for your app.')"
    />
    <SettingsForm
      v-else-if="block === 'settings-form'"
      email="hello@example.com"
      @save="notice('Preferences validated and saved locally.')"
    />
    <FilterList
      v-else-if="block === 'filter-list'"
      :items="projects"
      @select="notice('Selection updated locally.')"
    />
    <LoginForm
      v-else-if="block === 'login-form'"
      @submit="notice('Email validated. No sign-in email was sent.')"
    />
    <NotificationSettings
      v-else-if="block === 'notification-settings'"
      @save="notice('Notification preferences saved locally.')"
    />
    <TeamMembers
      v-else-if="block === 'team-members'"
      :members="members"
      @invite="notice('Your demo invitation is ready.')"
      @manage="notice('Selection updated locally.')"
    />
    <ShoppingCart
      v-else-if="block === 'shopping-cart'"
      :item="{ name: 'Everyday notebook', priceCents: 4800 }"
      :quantity="2"
      @checkout="notice('Demo order reviewed. No order was placed.')"
    />
    <OrderStatus
      v-else-if="block === 'order-status'"
      order-number="ST-2048"
      expected-date="Friday"
      :active="2"
      :steps="delivery"
      @track="notice('Your demo package is on schedule.')"
    />
    <BookingForm
      v-else-if="block === 'booking-form'"
      :min-date="dates.min"
      :max-date="dates.max"
      :date="dates.selected"
      @reserve="notice('Demo reservation selected.')"
    />
    <FeedbackForm
      v-else-if="block === 'feedback-form'"
      @submit="notice('Thanks for your demo review.')"
    />
    <ProjectTasks
      v-else-if="block === 'project-tasks'"
      :tasks="tasks"
      :completed="['tokens', 'components']"
    />
    <StatsCard
      v-else-if="block === 'stats-card'"
      :label="t('Monthly active members')"
      value="12,480"
      change="+24.5%"
      :progress="72"
    />
    <QuickActions
      v-else-if="block === 'quick-actions'"
      :actions="actions"
      @select="notice('Selection updated locally.')"
    />
    <AnnouncementFeed
      v-else-if="block === 'announcement-feed'"
      :sections="announcements"
      @open="notice('Your announcement is ready to connect to a detail page.')"
    />
    <EventAgenda
      v-else-if="block === 'event-agenda'"
      :events="events"
      @open="notice('Your event details are ready to explore.')"
    />
    <StudentSwitcher
      v-else-if="block === 'student-switcher'"
      :students="students"
      @select="notice('Student updated locally.')"
    />
    <ApplicationProgress
      v-else-if="block === 'application-progress'"
      applicant="Alex Taylor"
      program="Grade 5 · Autumn intake"
      :active="2"
      :steps="application"
      @continue="notice('Your next step is to choose a campus visit.')"
    />
    <ServiceInbox
      v-else-if="block === 'service-inbox'"
      :messages="messages"
      @open="notice('Message detail action selected.')"
      @read="notice('Message marked as read in this preview.')"
    />
    <SurveyCard
      v-else-if="block === 'survey-card'"
      :title="t('Your voice matters')"
      :description="t('Help shape next term\'s family activities.')"
      deadline="October 24"
      @start="notice('Your survey is ready to open.')"
    />
    <DocumentList
      v-else-if="block === 'document-list'"
      :documents="documents"
      @open="notice('Document detail action selected. No file was downloaded.')"
    />
  </GallerySection>
</template>
