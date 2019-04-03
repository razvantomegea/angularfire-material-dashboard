import { UserInfo as firebaseUserInfo, auth } from 'firebase/app';

import { isEqual } from 'app/shared/utils/lodash-exports';
import { UserBio } from './user-bio';

export class UserInfo implements firebaseUserInfo {
  constructor(
    public displayName: string,
    public email: string,
    public emailVerified: boolean,
    public metadata: auth.UserMetadata,
    public phoneNumber: string,
    public photoURL: string,
    public providerData: firebaseUserInfo[],
    public providerId: string,
    public uid: string,
    public userAdditional?: auth.AdditionalUserInfo,
    public bio?: UserBio
  ) {
  }

  public hasLinkedProvider(userInfo: UserInfo): string {
    const newProvider: firebaseUserInfo = userInfo.providerData.find((extProvider: firebaseUserInfo) => !this.providerData.find(
      (provider: firebaseUserInfo) => provider.providerId ===
        extProvider.providerId));

    return newProvider ? newProvider.providerId : '';
  }

  public hasUnLinkedProvider(userInfo: UserInfo): string {
    const newProvider: firebaseUserInfo = this.providerData.find((extProvider: firebaseUserInfo) => !userInfo.providerData.find(
      (provider: firebaseUserInfo) => provider.providerId ===
        extProvider.providerId));

    return newProvider ? newProvider.providerId : '';
  }

  public isDifferentEmail(userInfo: UserInfo): boolean {
    return this.email !== userInfo.email;
  }

  public isDifferentPhoneNumber(userInfo: UserInfo): boolean {
    return this.phoneNumber !== userInfo.phoneNumber;
  }

  public isDifferentProfile(userInfo: UserInfo): boolean {
    return this.displayName !== userInfo.displayName || this.photoURL !== userInfo.photoURL ||
      !isEqual(this.bio, userInfo.bio) || !isEqual(this.bio, userInfo.bio);
  }
}

export const userMock: UserInfo = <UserInfo>Object.create({
  'bio': {
    'age': 24,
    'constitution': {
      'bodyType': 'Mesomorph',
      'dominantDosha': 'Pitta',
      'kapha': {
        'body': {
          'appetite': true,
          'bodyTemperature': false,
          'breakfast': true,
          'complexion': false,
          'digestionElimination': false,
          'eyes': false,
          'fingersNails': false,
          'foodAmount': false,
          'frame': false,
          'hair': false,
          'lips': false,
          'perspiration': false,
          'pulse': false,
          'skinTexture': false,
          'sleep': true,
          'stimulants': true,
          'teeth': false,
          'total': 4,
          'voice': false,
          'walk': false,
          'weather': false,
          'weight': false
        },
        'bodyInfluence': 19,
        'mind': {
          'activity': false,
          'beliefs': false,
          'creativity': false,
          'decisions': true,
          'dreams': false,
          'finances': true,
          'interests': true,
          'learningType': false,
          'lifestyle': false,
          'love': false,
          'memory': true,
          'negativeTraits': false,
          'sexDrive': false,
          'social': false,
          'stressResponse': false,
          'talk': false,
          'temperament': false,
          'total': 4
        },
        'mindInfluence': 19,
        'total': 8,
        'totalInfluence': 19
      },
      'pitta': {
        'body': {
          'appetite': false,
          'bodyTemperature': true,
          'breakfast': false,
          'complexion': false,
          'digestionElimination': true,
          'eyes': true,
          'fingersNails': true,
          'foodAmount': true,
          'frame': true,
          'hair': true,
          'lips': true,
          'perspiration': true,
          'pulse': true,
          'skinTexture': true,
          'sleep': false,
          'stimulants': false,
          'teeth': true,
          'total': 16,
          'voice': true,
          'walk': true,
          'weather': true,
          'weight': true
        },
        'bodyInfluence': 76,
        'mind': {
          'activity': false,
          'beliefs': true,
          'creativity': true,
          'decisions': false,
          'dreams': true,
          'finances': false,
          'interests': false,
          'learningType': true,
          'lifestyle': true,
          'love': false,
          'memory': true,
          'negativeTraits': true,
          'sexDrive': false,
          'social': false,
          'stressResponse': true,
          'talk': false,
          'temperament': true,
          'total': 9
        },
        'mindInfluence': 43,
        'total': 25,
        'totalInfluence': 60
      },
      'vata': {
        'body': {
          'appetite': false,
          'bodyTemperature': false,
          'breakfast': false,
          'complexion': true,
          'digestionElimination': false,
          'eyes': false,
          'fingersNails': false,
          'foodAmount': false,
          'frame': false,
          'hair': false,
          'lips': false,
          'perspiration': false,
          'pulse': false,
          'skinTexture': false,
          'sleep': false,
          'stimulants': false,
          'teeth': false,
          'total': 1,
          'voice': false,
          'walk': false,
          'weather': false,
          'weight': false
        },
        'bodyInfluence': 5,
        'mind': {
          'activity': true,
          'beliefs': false,
          'creativity': false,
          'decisions': true,
          'dreams': true,
          'finances': false,
          'interests': false,
          'learningType': true,
          'lifestyle': false,
          'love': true,
          'memory': false,
          'negativeTraits': false,
          'sexDrive': true,
          'social': true,
          'stressResponse': false,
          'talk': true,
          'temperament': false,
          'total': 8
        },
        'mindInfluence': 38,
        'total': 9,
        'totalInfluence': 21
      }
    },
    'dateOfBirth': '31-07-1994',
    'gender': 'male',
    'geneticType': {
      'dominant': 'Temperate',
      'frigid': {
        'mental': {
          'activity': true,
          'beliefs': true,
          'creativity': true,
          'decisions': false,
          'dreams': true,
          'finances': true,
          'interests': true,
          'learningType': true,
          'lifestyle': true,
          'love': true,
          'memory': false,
          'negativeTraits': true,
          'personality': true,
          'sexDrive': true,
          'social': false,
          'stamina': true,
          'stressResponse': true,
          'total': 54
        },
        'nutritional': {
          'cravings': true,
          'dairy': false,
          'desserts': true,
          'eggs': false,
          'environment': false,
          'family': false,
          'fat': false,
          'fish': true,
          'fruits': false,
          'mealPref': true,
          'meat': false,
          'mood': true,
          'salads': true,
          'salt': true,
          'sleep': false,
          'snacks': true,
          'stamina': false,
          'total': 42
        },
        'origins': false,
        'physical': {
          'appetite': true,
          'digestionElimination': true,
          'eyes': false,
          'fingersNails': false,
          'foodAmount': true,
          'frame': true,
          'hair': false,
          'lips': false,
          'perspiration': true,
          'skin': false,
          'sleep': false,
          'stimulants': true,
          'teeth': true,
          'total': 61,
          'voice': true,
          'walk': true,
          'weather': true,
          'weight': true
        },
        'total': 3
      },
      'temperate': {
        'climate': true,
        'environment': true,
        'ethnicity': true,
        'mental': {
          'activity': false,
          'beliefs': false,
          'creativity': false,
          'decisions': true,
          'dreams': false,
          'finances': false,
          'interests': true,
          'learningType': false,
          'lifestyle': false,
          'love': false,
          'memory': true,
          'negativeTraits': false,
          'personality': false,
          'sexDrive': false,
          'social': false,
          'stamina': false,
          'stressResponse': false,
          'total': 12
        },
        'nutritional': {
          'cravings': true,
          'dairy': true,
          'desserts': false,
          'eggs': true,
          'environment': true,
          'family': true,
          'fat': true,
          'fish': false,
          'fruits': false,
          'mealPref': false,
          'meat': true,
          'mood': false,
          'salads': false,
          'salt': false,
          'sleep': true,
          'snacks': false,
          'stamina': true,
          'total': 47
        },
        'origins': true,
        'physical': {
          'appetite': false,
          'digestionElimination': false,
          'eyes': true,
          'fingersNails': true,
          'foodAmount': false,
          'frame': false,
          'hair': true,
          'lips': true,
          'perspiration': false,
          'skin': true,
          'sleep': true,
          'stimulants': false,
          'teeth': false,
          'total': 33,
          'voice': false,
          'walk': false,
          'weather': false,
          'weight': false
        },
        'total': 4
      },
      'torrid': {
        'mental': {
          'activity': true,
          'beliefs': false,
          'creativity': true,
          'decisions': true,
          'dreams': true,
          'finances': false,
          'interests': false,
          'learningType': false,
          'lifestyle': false,
          'love': true,
          'memory': false,
          'negativeTraits': false,
          'personality': false,
          'sexDrive': true,
          'social': true,
          'stamina': true,
          'stressResponse': true,
          'total': 35
        },
        'nutritional': {
          'cravings': false,
          'dairy': false,
          'desserts': false,
          'eggs': false,
          'environment': false,
          'family': false,
          'fat': false,
          'fish': false,
          'fruits': false,
          'mealPref': false,
          'meat': true,
          'mood': false,
          'salads': false,
          'salt': false,
          'sleep': false,
          'snacks': false,
          'stamina': true,
          'total': 11
        },
        'physical': {
          'appetite': false,
          'digestionElimination': true,
          'eyes': false,
          'fingersNails': false,
          'foodAmount': false,
          'frame': false,
          'hair': false,
          'lips': false,
          'perspiration': false,
          'skin': false,
          'sleep': false,
          'stimulants': false,
          'teeth': false,
          'total': 6,
          'voice': false,
          'walk': false,
          'weather': false,
          'weight': false
        },
        'total': 3
      }
    },
    'goal': 'I want to be look good and feel good forever.',
    'height': 180,
    'level': {
      'areas': [
        {
          'name': 'Sleep',
          'tips': [
            {
              'completed': false,
              'name': 'Go to bed and wake up at the same time.'
            },
            {
              'completed': false,
              'name': 'Get at least 7 hours of sleep.'
            },
            {
              'completed': false,
              'name': 'Go to bed before 10:30 PM.'
            },
            {
              'completed': false,
              'name': 'Turn off electronics (e.g. telephone, TV, PC, tablet, WiFI, etc.) 60 minutes before going asleep.'
            },
            {
              'completed': false,
              'name': 'Make you bedroom dark like a cave.'
            },
            {
              'completed': false,
              'name': 'Keep room temperature at 60-68 degrees F (16-20 degrees C).'
            }
          ]
        },
        {
          'name': 'Nutrition',
          'tips': [
            {
              'completed': false,
              'name': 'Eat only food prepared (minimally, correctly) by you.'
            },
            {
              'completed': false,
              'name': 'Drink only (pure) water.'
            },
            {
              'completed': false,
              'name': 'Substitute sweeteners with fruit, honey, and/or stevia leaves powder.'
            },
            {
              'completed': false,
              'name': 'Substitute margarine and vegetables oils with unprocessed coconut oil, avocado, butter, ghee, and/or lard.'
            },
            {
              'completed': false,
              'name': 'Buy mostly (>80%) food with least human intervention (wild).'
            },
            {
              'completed': false,
              'name': 'Eat only when truly hungry and stop when 80% full.'
            },
            {
              'completed': false,
              'name': 'Eat slowly, in a peaceful environment, when relaxed (take 10 deep breaths), ' +
                'and chew your food 30 times (until fluid).'
            }
          ]
        },
        {
          'name': 'Movement',
          'tips': [
            {
              'completed': false,
              'name': 'Move as much as you can (if possible, every 30-60 minutes) throughout the day.'
            },
            {
              'completed': false,
              'name': 'Walk at least 90 minutes per day.'
            },
            {
              'completed': false,
              'name': 'Train (30-45 heavy minutes) each muscle group 2-3 times per week with proper form, slowly, in full range of motion.'
            },
            {
              'completed': false,
              'name': 'Train (1-4 intense minutes) your cardiovascular system 1-2 times per week'
            }
          ]
        },
        {
          'name': 'Stress',
          'tips': [
            {
              'completed': false,
              'name': 'Have faith in the force within you.'
            },
            {
              'completed': false,
              'name': 'Visualize the best version of yourself (goal) and believe you can achieve it.'
            },
            {
              'completed': false,
              'name': 'Be grateful for everything you have and who you are.'
            },
            {
              'completed': false,
              'name': 'Be positive (smile) and surround yourself with positive people.'
            },
            {
              'completed': false,
              'name': 'Play, have fun, and unwind (relax, meditate) everyday.'
            }
          ]
        },
        {
          'name': 'Environment',
          'tips': [
            {
              'completed': false,
              'name': 'Get more sun light, fresh air, and bacteria (dirt) exposure (nature).'
            },
            {
              'completed': false,
              'name': 'Wash your hands before internal contact.'
            },
            {
              'completed': false,
              'name': 'Limit pharmaceuticals to only life threatening situations.'
            },
            {
              'completed': false,
              'name': 'Substitute plastic with glass or/and ceramic containers.'
            },
            {
              'completed': false,
              'name': 'Substitute chemical cleaning products and cosmetics with organic, natural ones.'
            }
          ]
        }
      ],
      'levelName': 'Jedi Master'
    },
    'summary': 'I am a good boy.',
    'weight': 78.99999999999999
  },
  'displayName': 'Razvan Tomegea',
  'email': 'razvan.tomegea@gmail.com',
  'emailVerified': true,
  'metadata': {
    'a': '1535808511000',
    'b': '1540126450000',
    'creationTime': 'Sat, 01 Sep 2018 13:28:31 GMT',
    'lastSignInTime': 'Sun, 21 Oct 2018 12:54:10 GMT'
  },
  'phoneNumber': '+40746466320',
  'photoURL': 'https://firebasestorage.googleapis.com/v0/b/angularfire-material-dashboard.appspot' +
    '.com/o/kAziJ89vcXXKTfLJ7Uw33QEk2JG3%2Fimages%2F42763879_805824963142262_2568140222508302336_o' +
    '.jpg?alt=media&token=02ca7100-11f4-4a20-8de4-a3ad06451f40',
  'providerData': [
    {
      'displayName': 'Razvan Tomegea',
      'email': 'razvan.tomegea@gmail.com',
      'phoneNumber': null,
      'photoURL': 'https://avatars3.githubusercontent.com/u/13073341?v=4',
      'providerId': 'github.com',
      'uid': '13073341'
    },
    {
      'displayName': 'Razvan Tomegea',
      'email': 'razvan.tomegea@gmail.com',
      'phoneNumber': null,
      'photoURL': 'https://lh6.googleusercontent.com/-RHOLN1TbLQ4/AAAAAAAAAAI/AAAAAAAAE5g/l9oDFfTxeAY/photo.jpg',
      'providerId': 'google.com',
      'uid': '113969030190145666520'
    },
    {
      'displayName': 'Razvan Tomegea',
      'email': 'razvan.tomegea@gmail.com',
      'phoneNumber': null,
      'photoURL': 'https://pbs.twimg.com/profile_images/914366390303379458/mxvNd_3e_normal.jpg',
      'providerId': 'twitter.com',
      'uid': '1704779287'
    },
    {
      'displayName': null,
      'email': null,
      'phoneNumber': '+40746466320',
      'photoURL': null,
      'providerId': 'phone',
      'uid': '+40746466320'
    },
    {
      'displayName': 'Razvan Tomegea',
      'email': 'razvan.tomegea@gmail.com',
      'phoneNumber': null,
      'photoURL': 'https://firebasestorage.googleapis.com/v0/b/angularfire-material-dashboard.appspot' +
        '.com/o/kAziJ89vcXXKTfLJ7Uw33QEk2JG3%2Fimages%2F42763879_805824963142262_2568140222508302336_o' +
        '.jpg?alt=media&token=02ca7100-11f4-4a20-8de4-a3ad06451f40',
      'providerId': 'password',
      'uid': 'razvan.tomegea@gmail.com'
    }
  ],
  'providerId': 'firebase',
  'uid': 'kAziJ89vcXXKTfLJ7Uw33QEk2JG3',
  'userAdditional': {
    'isNewUser': false,
    'profile': {
      'avatar_url': 'https://avatars3.githubusercontent.com/u/13073341?v=4',
      'bio': 'https://razvantomegea.com/#about',
      'blog': 'https://razvantomegea.com',
      'company': 'Individual',
      'contributors_enabled': false,
      'created_at': 'Tue Aug 27 13:51:36 +0000 2013',
      'default_profile': false,
      'default_profile_image': false,
      'description': 'I love fitness, web development, and music. I want to be the best version of myself (1% better everyday)!\n' +
        'My dream is to bring freedom our mind and spirit.',
      'email': 'razvan.tomegea@gmail.com',
      'entities': {
        'description': {
          'urls': []
        },
        'url': {
          'urls': [
            {
              'display_url': 'razvantomegea.com',
              'expanded_url': 'https://www.razvantomegea.com/',
              'indices': [
                0,
                23
              ],
              'url': 'https://t.co/SbtlUeWjSt'
            }
          ]
        }
      },
      'events_url': 'https://api.github.com/users/razvantomegea/events{/privacy}',
      'family_name': 'Tomegea',
      'favourites_count': 4,
      'follow_request_sent': false,
      'followers': 4,
      'followers_count': 35,
      'followers_url': 'https://api.github.com/users/razvantomegea/followers',
      'following': false,
      'following_url': 'https://api.github.com/users/razvantomegea/following{/other_user}',
      'friends_count': 40,
      'gender': 'male',
      'geo_enabled': true,
      'gists_url': 'https://api.github.com/users/razvantomegea/gists{/gist_id}',
      'given_name': 'Razvan',
      'gravatar_id': '',
      'has_extended_profile': true,
      'hireable': null,
      'html_url': 'https://github.com/razvantomegea',
      'id': 1704779287,
      'id_str': '1704779287',
      'is_translation_enabled': false,
      'is_translator': false,
      'lang': 'en',
      'link': 'https://plus.google.com/+RazvanTomegea',
      'listed_count': 1,
      'locale': 'en-GB',
      'location': 'Sibiu',
      'login': 'razvantomegea',
      'name': 'Razvan Tomegea',
      'needs_phone_verification': false,
      'node_id': 'MDQ6VXNlcjEzMDczMzQx',
      'notifications': false,
      'organizations_url': 'https://api.github.com/users/razvantomegea/orgs',
      'picture': 'https://lh6.googleusercontent.com/-RHOLN1TbLQ4/AAAAAAAAAAI/AAAAAAAADso/yu4Lr2mW_m0/photo.jpg',
      'profile_background_color': '000000',
      'profile_background_image_url': 'http://abs.twimg.com/images/themes/theme5/bg.gif',
      'profile_background_image_url_https': 'https://abs.twimg.com/images/themes/theme5/bg.gif',
      'profile_background_tile': false,
      'profile_banner_url': 'https://pbs.twimg.com/profile_banners/1704779287/1526828428',
      'profile_image_url': 'http://pbs.twimg.com/profile_images/914366390303379458/mxvNd_3e_normal.jpg',
      'profile_image_url_https': 'https://pbs.twimg.com/profile_images/914366390303379458/mxvNd_3e_normal.jpg',
      'profile_link_color': '91D2FA',
      'profile_sidebar_border_color': '000000',
      'profile_sidebar_fill_color': '000000',
      'profile_text_color': '000000',
      'profile_use_background_image': false,
      'protected': false,
      'public_gists': 5,
      'public_repos': 15,
      'received_events_url': 'https://api.github.com/users/razvantomegea/received_events',
      'repos_url': 'https://api.github.com/users/razvantomegea/repos',
      'screen_name': 'RazvanTomegea',
      'site_admin': false,
      'starred_url': 'https://api.github.com/users/razvantomegea/starred{/owner}{/repo}',
      'status': {
        'contributors': null,
        'coordinates': null,
        'created_at': 'Thu Sep 20 15:22:46 +0000 2018',
        'entities': {
          'hashtags': [],
          'symbols': [],
          'urls': [
            {
              'display_url': 'youtu.be/kjC1zmZo30U',
              'expanded_url': 'https://youtu.be/kjC1zmZo30U',
              'indices': [
                25,
                48
              ],
              'url': 'https://t.co/JCSGF2pTnt'
            }
          ],
          'user_mentions': [
            {
              'id': 10228272,
              'id_str': '10228272',
              'indices': [
                53,
                61
              ],
              'name': 'YouTube',
              'screen_name': 'YouTube'
            }
          ]
        },
        'favorite_count': 0,
        'favorited': false,
        'geo': null,
        'id': 1042796216411664000,
        'id_str': '1042796216411664385',
        'in_reply_to_screen_name': null,
        'in_reply_to_status_id': null,
        'in_reply_to_status_id_str': null,
        'in_reply_to_user_id': null,
        'in_reply_to_user_id_str': null,
        'is_quote_status': false,
        'lang': 'en',
        'place': null,
        'possibly_sensitive': false,
        'retweet_count': 0,
        'retweeted': false,
        'source': 'http://twitter.com',
        'text': 'TAG - Official Trailer 1 https://t.co/JCSGF2pTnt via @YouTube',
        'truncated': false
      },
      'statuses_count': 2397,
      'subscriptions_url': 'https://api.github.com/users/razvantomegea/subscriptions',
      'suspended': false,
      'time_zone': null,
      'translator_type': 'none',
      'type': 'User',
      'updated_at': '2018-09-06T14:41:00Z',
      'url': 'https://t.co/SbtlUeWjSt',
      'utc_offset': null,
      'verified': false,
      'verified_email': true
    },
    'providerId': 'phone',
    'username': 'RazvanTomegea'
  }
});
