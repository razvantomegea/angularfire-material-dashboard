import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { State } from 'app/core/store/app.reducers';
import * as fromUser from 'app/core/store/user/reducers';
import { ComponentDestroyed } from 'app/shared/mixins';
import { Observable, takeUntil } from 'app/shared/utils/rxjs-exports';
import { HealthyHabitsLevel } from './model';

export const HEALTHY_HABITS_LEVELS: HealthyHabitsLevel[] = [
  {
    levelName: 'Padawan',
    areas: [
      {
        name: 'Sleep',
        tips: [
          {
            'name': 'Go to bed and wake up at the same time.',
            'completed': false
          },
          {
            'name': 'Get at least 7 hours of sleep.',
            'completed': false
          }
        ]
      },
      {
        name: 'Nutrition',
        tips: [
          {
            'name': 'Eat only food prepared (minimally, correctly) by you.',
            'completed': false
          },
          {
            'name': 'Drink only (pure) water.',
            'completed': false
          }
        ]
      },
      {
        name: 'Movement',
        tips: [
          {
            'name': 'Move as much as you can (if possible, every 30-60 minutes) throughout the day.',
            'completed': false
          }
        ]
      },
      {
        name: 'Mindset',
        tips: [
          {
            'name': 'Have faith in the force within you.',
            'completed': false
          },
          {
            'name': 'Visualize the best version of yourself (goal) and believe you can achieve it.',
            'completed': false
          }
        ]
      },
      {
        name: 'Environment',
        tips: [
          {
            'name': 'Get more sun light, fresh air, and bacteria (dirt) exposure (nature).',
            'completed': false
          },
          {
            'name': 'Wash your hands before internal contact.',
            'completed': false
          }
        ]
      }
    ]
  },
  {
    levelName: 'Jedi',
    areas: [
      {
        name: 'Sleep',
        tips: [
          {
            'name': 'Go to bed and wake up at the same time.',
            'completed': false
          },
          {
            'name': 'Get at least 7 hours of sleep.',
            'completed': false
          },
          {
            'name': 'Go to bed before 10:30 PM.',
            'completed': false
          }
        ]
      },
      {
        name: 'Nutrition',
        tips: [
          {
            'name': 'Eat only food prepared (minimally, correctly) by you.',
            'completed': false
          },
          {
            'name': 'Drink only (pure) water.',
            'completed': false
          },
          {
            'name': 'Substitute sweeteners with fruit, honey, and/or stevia leaves powder.',
            'completed': false
          },
          {
            'name': 'Substitute margarine and vegetables oils with unprocessed coconut oil, avocado, butter, ghee, and/or lard.',
            'completed': false
          }
        ]
      },
      {
        name: 'Movement',
        tips: [
          {
            'name': 'Move as much as you can (if possible, every 30-60 minutes) throughout the day.',
            'completed': false
          },
          {
            'name': 'Walk at least 90 minutes per day.',
            'completed': false
          }
        ]
      },
      {
        name: 'Mindset',
        tips: [
          {
            'name': 'Have faith in the force within you.',
            'completed': false
          },
          {
            'name': 'Visualize the best version of yourself (goal) and believe you can achieve it.',
            'completed': false
          },
          {
            'name': 'Be grateful for everything you have and who you are.',
            'completed': false
          }
        ]
      },
      {
        name: 'Environment',
        tips: [
          {
            'name': 'Get more sun light, fresh air, and bacteria (dirt) exposure (nature).',
            'completed': false
          },
          {
            'name': 'Wash your hands before internal contact.',
            'completed': false
          },
          {
            'name': 'Limit pharmaceuticals to only life threatening situations.',
            'completed': false
          }
        ]
      }
    ]
  },
  {
    levelName: 'Jedi Knight',
    areas: [
      {
        name: 'Sleep',
        tips: [
          {
            'name': 'Go to bed and wake up at the same time.',
            'completed': false
          },
          {
            'name': 'Get at least 7 hours of sleep.',
            'completed': false
          },
          {
            'name': 'Go to bed before 10:30 PM.',
            'completed': false
          },
          {
            'name': 'Turn off electronics (e.g. telephone, TV, PC, tablet, WiFI, etc.) 60 minutes before going asleep.',
            'completed': false
          }
        ]
      },
      {
        name: 'Nutrition',
        tips: [
          {
            'name': 'Eat only food prepared (minimally, correctly) by you.',
            'completed': false
          },
          {
            'name': 'Drink only (pure) water.',
            'completed': false
          },
          {
            'name': 'Substitute sweeteners with fruit, honey, and/or stevia leaves powder.',
            'completed': false
          },
          {
            'name': 'Substitute margarine and vegetables oils with unprocessed coconut oil, avocado, butter, ghee, and/or lard.',
            'completed': false
          },
          {
            'name': 'Buy mostly (>80%) food with least human intervention (wild).',
            'completed': false
          }
        ]
      },
      {
        name: 'Movement',
        tips: [
          {
            'name': 'Move as much as you can (if possible, every 30-60 minutes) throughout the day.',
            'completed': false
          },
          {
            'name': 'Walk at least 90 minutes per day.',
            'completed': false
          },
          {
            'name': 'Train (30-45 heavy minutes) each muscle group 2-3 times per week with proper form, slowly, in full range of motion.',
            'completed': false
          }
        ]
      },
      {
        name: 'Mindset',
        tips: [
          {
            'name': 'Have faith in the force within you.',
            'completed': false
          },
          {
            'name': 'Visualize the best version of yourself (goal) and believe you can achieve it.',
            'completed': false
          },
          {
            'name': 'Be grateful for everything you have and who you are.',
            'completed': false
          },
          {
            'name': 'Be positive (smile) and surround yourself with positive people.',
            'completed': false
          }
        ]
      },
      {
        name: 'Environment',
        tips: [
          {
            'name': 'Get more sun light, fresh air, and bacteria (dirt) exposure (nature).',
            'completed': false
          },
          {
            'name': 'Wash your hands before internal contact.',
            'completed': false
          },
          {
            'name': 'Limit pharmaceuticals to only life threatening situations.',
            'completed': false
          },
          {
            'name': 'Substitute plastic with glass or/and ceramic containers.',
            'completed': false
          }
        ]
      }
    ]
  },
  {
    levelName: 'Jedi Master',
    areas: [
      {
        name: 'Sleep',
        tips: [
          {
            'name': 'Go to bed and wake up at the same time.',
            'completed': false
          },
          {
            'name': 'Get at least 7 hours of sleep.',
            'completed': false
          },
          {
            'name': 'Go to bed before 10:30 PM.',
            'completed': false
          },
          {
            'name': 'Turn off electronics (e.g. telephone, TV, PC, tablet, WiFI, etc.) 60 minutes before going asleep.',
            'completed': false
          },
          {
            'name': 'Make you bedroom dark like a cave.',
            'completed': false
          },
          {
            'name': 'Keep room temperature at 60-68 degrees F (16-20 degrees C).',
            'completed': false
          }
        ]
      },
      {
        name: 'Nutrition',
        tips: [
          {
            'name': 'Eat only food prepared (minimally, correctly) by you.',
            'completed': false
          },
          {
            'name': 'Drink only (pure) water.',
            'completed': false
          },
          {
            'name': 'Substitute sweeteners with fruit, honey, and/or stevia leaves powder.',
            'completed': false
          },
          {
            'name': 'Substitute margarine and vegetables oils with unprocessed coconut oil, avocado, butter, ghee, and/or lard.',
            'completed': false
          },
          {
            'name': 'Buy mostly (>80%) food with least human intervention (wild).',
            'completed': false
          },
          {
            'name': 'Eat only when truly hungry and stop when 80% full.',
            'completed': false
          },
          {
            'name': 'Eat slowly, in a peaceful environment, when relaxed (take 10 deep breaths), and chew your food 30 times' +
              ' (until fluid).',
            'completed': false
          }
        ]
      },
      {
        name: 'Movement',
        tips: [
          {
            'name': 'Move as much as you can (if possible, every 30-60 minutes) throughout the day.',
            'completed': false
          },
          {
            'name': 'Walk at least 90 minutes per day.',
            'completed': false
          },
          {
            'name': 'Train (30-45 heavy minutes) each muscle group 2-3 times per week with proper form, slowly, in full range of motion.',
            'completed': false
          },
          {
            'name': 'Train (1-4 intense minutes) your cardiovascular system 1-2 times per week',
            'completed': false
          }
        ]
      },
      {
        name: 'Mindset',
        tips: [
          {
            'name': 'Have faith in the force within you.',
            'completed': false
          },
          {
            'name': 'Visualize the best version of yourself (goal) and believe you can achieve it.',
            'completed': false
          },
          {
            'name': 'Be grateful for everything you have and who you are.',
            'completed': false
          },
          {
            'name': 'Be positive (smile) and surround yourself with positive people.',
            'completed': false
          },
          {
            'name': 'Play, have fun, and unwind (relax, meditate) everyday.',
            'completed': false
          }
        ]
      },
      {
        name: 'Environment',
        tips: [
          {
            'name': 'Get more sun light, fresh air, and bacteria (dirt) exposure (nature).',
            'completed': false
          },
          {
            'name': 'Wash your hands before internal contact.',
            'completed': false
          },
          {
            'name': 'Limit pharmaceuticals to only life threatening situations.',
            'completed': false
          },
          {
            'name': 'Substitute plastic with glass or/and ceramic containers.',
            'completed': false
          },
          {
            'name': 'Substitute chemical cleaning products and cosmetics with organic, natural ones.',
            'completed': false
          }
        ]
      }
    ]
  },
  {
    levelName: 'Yoda',
    areas: [
      {
        name: 'Sleep',
        tips: [
          {
            'name': 'Go to bed and wake up at the same time.',
            'completed': false
          },
          {
            'name': 'Get at least 7 hours of sleep.',
            'completed': false
          },
          {
            'name': 'Go to bed before 10:30 PM.',
            'completed': false
          },
          {
            'name': 'Turn off electronics (e.g. telephone, TV, PC, tablet, WiFI, etc.) 60 minutes before going asleep.',
            'completed': false
          },
          {
            'name': 'Make you bedroom dark like a cave.',
            'completed': false
          },
          {
            'name': 'Keep room temperature at 60-68 degrees F (16-20 degrees C).',
            'completed': false
          },
          {
            'name': 'Avoid stimulants (e.g. coffee, green/black tea, alcohol, etc.) after noon.',
            'completed': false
          }
        ]
      },
      {
        name: 'Nutrition',
        tips: [
          {
            'name': 'Eat only food prepared (minimally, correctly) by you.',
            'completed': false
          },
          {
            'name': 'Drink only (pure) water.',
            'completed': false
          },
          {
            'name': 'Substitute sweeteners with fruit, honey, and/or stevia leaves powder.',
            'completed': false
          },
          {
            'name': 'Substitute margarine and vegetables oils with unprocessed coconut oil, avocado, butter, ghee, and/or lard.',
            'completed': false
          },
          {
            'name': 'Buy mostly (>80%) food with least human intervention (wild).',
            'completed': false
          },
          {
            'name': 'Eat only when truly hungry and stop when 80% full.',
            'completed': false
          },
          {
            'name': 'Eat slowly, in a peaceful environment, when relaxed (take 10 deep breaths), and chew your food 30 times' +
              ' (until fluid).',
            'completed': false
          },
          {
            'name': 'Eat mostly organic (>80%) and fresh (local, in season).',
            'completed': false
          },
          {
            'name': 'Supplement with whole organic raw superfoods.',
            'completed': false
          }
        ]
      },
      {
        name: 'Movement',
        tips: [
          {
            'name': 'Move as much as you can (if possible, every 30-60 minutes) throughout the day.',
            'completed': false
          },
          {
            'name': 'Walk at least 90 minutes per day.',
            'completed': false
          },
          {
            'name': 'Train (30-45 heavy minutes) each muscle group 2-3 times per week with proper form, slowly, in full range of motion.',
            'completed': false
          },
          {
            'name': 'Train (1-4 intense minutes) your cardiovascular system 1-2 times per week',
            'completed': false
          },
          {
            'name': 'Train your flexibility and balance 2-3 times per week.',
            'completed': false
          }
        ]
      },
      {
        name: 'Mindset',
        tips: [
          {
            'name': 'Have faith in the force within you.',
            'completed': false
          },
          {
            'name': 'Visualize the best version of yourself (goal) and believe you can achieve it.',
            'completed': false
          },
          {
            'name': 'Be grateful for everything you have and who you are.',
            'completed': false
          },
          {
            'name': 'Be positive (smile) and surround yourself with positive people.',
            'completed': false
          },
          {
            'name': 'Play, have fun, and unwind (relax, meditate) everyday.',
            'completed': false
          },
          {
            'name': 'Be present.',
            'completed': false
          }
        ]
      },
      {
        name: 'Environment',
        tips: [
          {
            'name': 'Get more sun light, fresh air, and bacteria (dirt) exposure (nature).',
            'completed': false
          },
          {
            'name': 'Wash your hands before internal contact.',
            'completed': false
          },
          {
            'name': 'Limit pharmaceuticals to only life threatening situations.',
            'completed': false
          },
          {
            'name': 'Substitute plastic with glass or/and ceramic containers.',
            'completed': false
          },
          {
            'name': 'Substitute chemical cleaning products and cosmetics with organic, natural ones.',
            'completed': false
          },
          {
            'name': 'Substitute unhealthy habits with healthy ones.',
            'completed': false
          }
        ]
      }
    ]
  }
];

@Component({
  selector: 'app-guide',
  templateUrl: './healthy-habits.component.html',
  styleUrls: ['./healthy-habits.component.scss']
})
export class HealthyHabitsComponent extends ComponentDestroyed {
  public readonly guideLevel$: Observable<HealthyHabitsLevel> = this.store.pipe(select(fromUser.getUserLevel), takeUntil(this.isDestroyed$));

  constructor(public store: Store<State>) {
    super();
  }

  // TODO: Details page for each recommendation
  // TODO: Keep track of daily healthy-habits completions and make recommendations to upgrade/downgrade level
  // TODO: Move each healthy-habits sections to module pages (e.g. nutrition recommendations to Nutrition Module)
}
