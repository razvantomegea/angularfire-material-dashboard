import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../admin/services';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path: '', component: DashboardComponent, canActivateChild: [AuthGuard], children: [
      {
        path: 'learn',
        loadChildren: 'app/dashboard/learn/learn.module#LearnModule',
        data: {
          title: 'Learn'
        }
      }, {
        path: 'healthy-habits',
        loadChildren: 'app/dashboard/healthy-habits/healthy-habits.module#HealthyHabitsModule',
        data: {
          title: 'Healthy Habits'
        }
      }, {
        path: 'getting-started',
        loadChildren: 'app/dashboard/getting-started/getting-started.module#GettingStartedModule',
        data: {
          title: 'Getting Started'
        }
      }, {
        path: 'body-composition',
        loadChildren: 'app/dashboard/body-composition/body-composition.module#BodyCompositionModule',
        data: {
          title: 'Body composition'
        }
      }, {
        path: 'nutrition',
        loadChildren: 'app/dashboard/nutrition/nutrition.module#NutritionModule',
        data: {
          title: 'Nutrition'
        }
      }, {
        path: 'movement',
        loadChildren: 'app/dashboard/movement/movement.module#MovementModule',
        data: {
          title: 'Movement'
        }
      }, {
        path: 'sleep',
        loadChildren: 'app/dashboard/sleep/sleep.module#SleepModule',
        data: {
          title: 'Sleep'
        }
      }, {
        path: 'stress',
        loadChildren: 'app/dashboard/stress/stress.module#StressModule',
        data: {
          title: 'Stress'
        }
      }, {
        path: 'blood-glucose',
        loadChildren: 'app/dashboard/blood-glucose/blood-glucose.module#BloodGlucoseModule',
        data: {
          title: 'Blood Glucose'
        }
      }, {
        path: 'blood-homocysteine',
        loadChildren: 'app/dashboard/blood-homocysteine/blood-homocysteine.module#BloodHomocysteineModule',
        data: {
          title: 'Blood Homocysteine'
        }
      }, {
        path: 'blood-ketones',
        loadChildren: 'app/dashboard/blood-ketones/blood-ketones.module#BloodKetonesModule',
        data: {
          title: 'Blood Ketones'
        }
      }, {
        path: 'blood-lipids',
        loadChildren: 'app/dashboard/blood-lipids/blood-lipids.module#BloodLipidsModule',
        data: {
          title: 'Blood Lipids'
        }
      }, {
        path: 'blood-pressure',
        loadChildren: 'app/dashboard/blood-pressure/blood-pressure.module#BloodPressureModule',
        data: {
          title: 'Blood Pressure'
        }
      }, {
        path: 'foods',
        loadChildren: 'app/dashboard/foods/foods.module#FoodsModule',
        data: {
          title: 'Foods database'
        }
      }, {
        path: 'exercises',
        loadChildren: 'app/dashboard/exercises/exercises.module#ExercisesModule',
        data: {
          title: 'Exercises'
        }
      }, {
        path: 'diagnosis',
        loadChildren: 'app/dashboard/diagnosis/diagnosis.module#DiagnosisModule',
        data: {
          title: 'Diagnosis'
        }
      }, {
        path: 'settings',
        loadChildren: 'app/dashboard/settings/settings.module#SettingsModule',
        data: {
          title: 'Settings'
        }
      }, {
        path: '', loadChildren: 'app/dashboard/overview/overview.module#OverviewModule', data: {
          title: 'Overview'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)], exports: [RouterModule]
})
export class DashboardRoutingModule {
}
