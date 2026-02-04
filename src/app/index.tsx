import { Card, CardHeader, TabList, Tab, Title1 } from '@fluentui/react-components'
import * as Cmd from 'tea-effect/Cmd'
import * as Html from 'tea-effect/Html'
import * as Sub from 'tea-effect/Sub'
import * as Platform from 'tea-effect/Platform'
import * as TeaReact from 'tea-effect/React'
import * as Counter from '../counter'
import * as PersistentCounter from '../persistent-counter'
import * as Timer from '../timer'
import * as Users from '../users'
import * as Random from '../random'
import * as NavigationDemo from '../navigation-demo'

type ActiveTab = 'counter' | 'persistent-counter' | 'timer' | 'users' | 'random' | 'navigation'

export type Model = {
  activeTab: ActiveTab
  counter: Counter.Model
  persistentCounter: PersistentCounter.Model
  timer: Timer.Model
  users: Users.Model
  random: Random.Model
  navigation: NavigationDemo.Model
}

export type Msg =
  | { type: 'SetTab'; tab: ActiveTab }
  | { type: 'CounterMsg'; msg: Counter.Msg }
  | { type: 'PersistentCounterMsg'; msg: PersistentCounter.Msg }
  | { type: 'TimerMsg'; msg: Timer.Msg }
  | { type: 'UsersMsg'; msg: Users.Msg }
  | { type: 'RandomMsg'; msg: Random.Msg }
  | { type: 'NavigationMsg'; msg: NavigationDemo.Msg }

const [counterInit, counterCmd] = Counter.init
const [persistentCounterInit, persistentCounterCmd] = PersistentCounter.init
const [timerInit, timerCmd] = Timer.init
const [usersInit, usersCmd] = Users.init
const [randomInit, randomCmd] = Random.init
const [navigationInit, navigationCmd] = NavigationDemo.init

export const init: [Model, Cmd.Cmd<Msg>] = [
  {
    activeTab: 'counter',
    counter: counterInit,
    persistentCounter: persistentCounterInit,
    timer: timerInit,
    users: usersInit,
    random: randomInit,
    navigation: navigationInit,
  },
  Cmd.batch([
    Cmd.map((msg: Counter.Msg): Msg => ({ type: 'CounterMsg', msg }))(counterCmd),
    Cmd.map((msg: PersistentCounter.Msg): Msg => ({ type: 'PersistentCounterMsg', msg }))(persistentCounterCmd),
    Cmd.map((msg: Timer.Msg): Msg => ({ type: 'TimerMsg', msg }))(timerCmd),
    Cmd.map((msg: Users.Msg): Msg => ({ type: 'UsersMsg', msg }))(usersCmd),
    Cmd.map((msg: Random.Msg): Msg => ({ type: 'RandomMsg', msg }))(randomCmd),
    Cmd.map((msg: NavigationDemo.Msg): Msg => ({ type: 'NavigationMsg', msg }))(navigationCmd),
  ]),
]

export const update = (msg: Msg, model: Model): [Model, Cmd.Cmd<Msg>] => {
  switch (msg.type) {
    case 'SetTab':
      return [{ ...model, activeTab: msg.tab }, Cmd.none]
    case 'CounterMsg': {
      const [counter, cmd] = Counter.update(msg.msg, model.counter)
      return [{ ...model, counter }, Cmd.map((m: Counter.Msg): Msg => ({ type: 'CounterMsg', msg: m }))(cmd)]
    }
    case 'PersistentCounterMsg': {
      const [persistentCounter, cmd] = PersistentCounter.update(msg.msg, model.persistentCounter)
      return [
        { ...model, persistentCounter },
        Cmd.map((m: PersistentCounter.Msg): Msg => ({ type: 'PersistentCounterMsg', msg: m }))(cmd),
      ]
    }
    case 'TimerMsg': {
      const [timer, cmd] = Timer.update(msg.msg, model.timer)
      return [{ ...model, timer }, Cmd.map((m: Timer.Msg): Msg => ({ type: 'TimerMsg', msg: m }))(cmd)]
    }
    case 'UsersMsg': {
      const [users, cmd] = Users.update(msg.msg, model.users)
      return [{ ...model, users }, Cmd.map((m: Users.Msg): Msg => ({ type: 'UsersMsg', msg: m }))(cmd)]
    }
    case 'RandomMsg': {
      const [random, cmd] = Random.update(msg.msg, model.random)
      return [{ ...model, random }, Cmd.map((m: Random.Msg): Msg => ({ type: 'RandomMsg', msg: m }))(cmd)]
    }
    case 'NavigationMsg': {
      const [navigation, cmd] = NavigationDemo.update(msg.msg, model.navigation)
      return [
        { ...model, navigation },
        Cmd.map((m: NavigationDemo.Msg): Msg => ({ type: 'NavigationMsg', msg: m }))(cmd),
      ]
    }
  }
}

export const subscriptions = (model: Model): Sub.Sub<Msg> =>
  Sub.batch([
    Sub.map((msg: PersistentCounter.Msg): Msg => ({ type: 'PersistentCounterMsg', msg }))(
      PersistentCounter.subscriptions(model.persistentCounter),
    ),
    Sub.map((msg: Timer.Msg): Msg => ({ type: 'TimerMsg', msg }))(Timer.subscriptions(model.timer)),
    Sub.map((msg: NavigationDemo.Msg): Msg => ({ type: 'NavigationMsg', msg }))(
      NavigationDemo.subscriptions(model.navigation),
    ),
  ])

const renderContent = (model: Model): TeaReact.Html<Msg> => {
  switch (model.activeTab) {
    case 'counter':
      return Html.map((msg: Counter.Msg): Msg => ({ type: 'CounterMsg', msg }))(Counter.view(model.counter))
    case 'persistent-counter':
      return Html.map((msg: PersistentCounter.Msg): Msg => ({ type: 'PersistentCounterMsg', msg }))(
        PersistentCounter.view(model.persistentCounter),
      )
    case 'timer':
      return Html.map((msg: Timer.Msg): Msg => ({ type: 'TimerMsg', msg }))(Timer.view(model.timer))
    case 'users':
      return Html.map((msg: Users.Msg): Msg => ({ type: 'UsersMsg', msg }))(Users.view(model.users))
    case 'random':
      return Html.map((msg: Random.Msg): Msg => ({ type: 'RandomMsg', msg }))(Random.view(model.random))
    case 'navigation':
      return Html.map((msg: NavigationDemo.Msg): Msg => ({ type: 'NavigationMsg', msg }))(
        NavigationDemo.view(model.navigation),
      )
  }
}

export const view =
  (model: Model): TeaReact.Html<Msg> =>
  (dispatch: Platform.Dispatch<Msg>) =>
    (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 32, gap: 24 }}>
        <Title1>tea-effect examples</Title1>

        <Card style={{ width: '100%', maxWidth: 600 }}>
          <CardHeader
            header={
              <TabList
                selectedValue={model.activeTab}
                onTabSelect={(_, data) => dispatch({ type: 'SetTab', tab: data.value as ActiveTab })}
              >
                <Tab value="counter">Counter</Tab>
                <Tab value="random">Random</Tab>
                <Tab value="persistent-counter">Persistent</Tab>
                <Tab value="timer">Timer</Tab>
                <Tab value="users">Users</Tab>
                <Tab value="navigation">Navigation</Tab>
              </TabList>
            }
          />
          <div style={{ padding: 16 }}>{renderContent(model)(dispatch)}</div>
        </Card>
      </div>
    )
