"""
Ayurveda Domain Knowledge
Dosha system, ingredient properties, and health goal mappings
"""

from typing import Dict, List, Optional


# Dosha Properties and Characteristics
DOSHA_PROPERTIES = {
    'VATA': {
        'elements': ['Air', 'Space'],
        'qualities': ['Dry', 'Light', 'Cold', 'Rough', 'Subtle', 'Mobile'],
        'season': ['Fall', 'Early Winter'],
        'time_of_day': ['2am-6am', '2pm-6pm'],
        'balance_foods': ['Warm', 'Moist', 'Grounding', 'Sweet', 'Sour', 'Salty'],
        'avoid_foods': ['Cold', 'Dry', 'Light', 'Bitter', 'Pungent', 'Astringent'],
        'recommended_tastes': ['Sweet', 'Sour', 'Salty'],
        'characteristics': ['Creative', 'Quick thinking', 'Energetic', 'Thin build'],
        'imbalance_symptoms': ['Anxiety', 'Dry skin', 'Constipation', 'Insomnia'],
    },
    'PITTA': {
        'elements': ['Fire', 'Water'],
        'qualities': ['Hot', 'Sharp', 'Light', 'Liquid', 'Spreading', 'Oily'],
        'season': ['Summer', 'Late Spring'],
        'time_of_day': ['10am-2pm', '10pm-2am'],
        'balance_foods': ['Cool', 'Sweet', 'Bitter', 'Astringent'],
        'avoid_foods': ['Spicy', 'Hot', 'Sour', 'Salty', 'Pungent'],
        'recommended_tastes': ['Sweet', 'Bitter', 'Astringent'],
        'characteristics': ['Focused', 'Competitive', 'Strong digestion', 'Medium build'],
        'imbalance_symptoms': ['Irritability', 'Inflammation', 'Acid reflux', 'Skin rashes'],
    },
    'KAPHA': {
        'elements': ['Earth', 'Water'],
        'qualities': ['Heavy', 'Slow', 'Cool', 'Oily', 'Smooth', 'Dense', 'Stable'],
        'season': ['Spring', 'Late Winter'],
        'time_of_day': ['6am-10am', '6pm-10pm'],
        'balance_foods': ['Light', 'Dry', 'Warm', 'Pungent', 'Bitter', 'Astringent'],
        'avoid_foods': ['Heavy', 'Oily', 'Cold', 'Sweet', 'Sour', 'Salty'],
        'recommended_tastes': ['Pungent', 'Bitter', 'Astringent'],
        'characteristics': ['Calm', 'Steady', 'Strong', 'Heavy build'],
        'imbalance_symptoms': ['Lethargy', 'Weight gain', 'Congestion', 'Depression'],
    },
}

# Ayurvedic Herb/Ingredient Properties
INGREDIENT_PROPERTIES = {
    'Ashwagandha': {
        'sanskrit_name': 'Withania somnifera',
        'rasa': ['Bitter', 'Astringent'],  # Taste
        'virya': 'Hot',  # Potency
        'vipaka': 'Sweet',  # Post-digestive effect
        'guna': ['Heavy', 'Unctuous'],  # Qualities
        'dosha_effect': {
            'VATA': 'balances',
            'PITTA': 'may increase (in excess)',
            'KAPHA': 'balances',
        },
        'benefits': [
            'Stress relief',
            'Strength and vitality',
            'Immunity boost',
            'Cognitive function',
            'Sleep quality',
            'Adaptogenic properties'
        ],
        'contraindications': ['Pregnancy', 'Hyperthyroidism', 'Auto-immune conditions'],
        'category': 'Rasayana (Rejuvenation)',
    },
    'Turmeric': {
        'sanskrit_name': 'Curcuma longa',
        'rasa': ['Bitter', 'Pungent'],
        'virya': 'Hot',
        'vipaka': 'Pungent',
        'guna': ['Dry', 'Light'],
        'dosha_effect': {
            'VATA': 'balances (in moderation)',
            'PITTA': 'may increase (in excess)',
            'KAPHA': 'balances',
        },
        'benefits': [
            'Anti-inflammatory',
            'Immunity boost',
            'Skin health',
            'Liver support',
            'Antioxidant',
            'Joint health'
        ],
        'contraindications': ['Gallstones', 'Blood thinning medications'],
        'category': 'Rasayana (Rejuvenation)',
    },
    'Triphala': {
        'sanskrit_name': 'Three fruits (Amalaki, Bibhitaki, Haritaki)',
        'rasa': ['All six tastes'],
        'virya': 'Neutral',
        'vipaka': 'Sweet',
        'guna': ['Light', 'Dry'],
        'dosha_effect': {
            'VATA': 'balances',
            'PITTA': 'balances',
            'KAPHA': 'balances',
        },
        'benefits': [
            'Digestive health',
            'Detoxification',
            'Eye health',
            'Immune support',
            'Regular elimination',
            'Antioxidant'
        ],
        'contraindications': ['Diarrhea', 'Pregnancy', 'Severe dehydration'],
        'category': 'Rasayana (Rejuvenation)',
    },
    'Brahmi': {
        'sanskrit_name': 'Bacopa monnieri',
        'rasa': ['Bitter', 'Sweet'],
        'virya': 'Cool',
        'vipaka': 'Sweet',
        'guna': ['Light'],
        'dosha_effect': {
            'VATA': 'balances',
            'PITTA': 'balances',
            'KAPHA': 'may increase (in excess)',
        },
        'benefits': [
            'Memory enhancement',
            'Cognitive function',
            'Stress relief',
            'Mental clarity',
            'Anxiety reduction',
            'Sleep quality'
        ],
        'contraindications': ['Hypothyroidism (high doses)'],
        'category': 'Medhya Rasayana (Brain tonic)',
    },
    'Tulsi': {
        'sanskrit_name': 'Ocimum sanctum',
        'rasa': ['Pungent', 'Bitter'],
        'virya': 'Hot',
        'vipaka': 'Pungent',
        'guna': ['Light', 'Dry'],
        'dosha_effect': {
            'VATA': 'balances',
            'PITTA': 'may increase',
            'KAPHA': 'balances',
        },
        'benefits': [
            'Immunity boost',
            'Respiratory health',
            'Stress relief',
            'Adaptogenic',
            'Anti-microbial',
            'Heart health'
        ],
        'contraindications': ['Pregnancy (high doses)', 'Blood thinning medications'],
        'category': 'Rasayana (Rejuvenation)',
    },
    'Shatavari': {
        'sanskrit_name': 'Asparagus racemosus',
        'rasa': ['Sweet', 'Bitter'],
        'virya': 'Cool',
        'vipaka': 'Sweet',
        'guna': ['Heavy', 'Unctuous'],
        'dosha_effect': {
            'VATA': 'balances',
            'PITTA': 'balances',
            'KAPHA': 'may increase',
        },
        'benefits': [
            'Female reproductive health',
            'Hormonal balance',
            'Digestive support',
            'Immune boost',
            'Lactation support',
            'Cooling effect'
        ],
        'contraindications': ['Estrogen-sensitive conditions'],
        'category': 'Rasayana (Rejuvenation)',
    },
    'Ginger': {
        'sanskrit_name': 'Zingiber officinale',
        'rasa': ['Pungent'],
        'virya': 'Hot',
        'vipaka': 'Sweet',
        'guna': ['Light', 'Unctuous'],
        'dosha_effect': {
            'VATA': 'balances',
            'PITTA': 'may increase',
            'KAPHA': 'balances',
        },
        'benefits': [
            'Digestive fire (Agni)',
            'Nausea relief',
            'Anti-inflammatory',
            'Respiratory health',
            'Circulation',
            'Pain relief'
        ],
        'contraindications': ['Ulcers', 'High Pitta conditions'],
        'category': 'Digestive aid',
    },
}

# Health Goals to Ingredient Mapping
HEALTH_GOALS = {
    'immunity': {
        'description': 'Boost immune system and overall vitality',
        'recommended_herbs': ['Ashwagandha', 'Turmeric', 'Tulsi', 'Amalaki', 'Guduchi'],
        'dosha_recommendations': {
            'VATA': ['Ashwagandha', 'Shatavari', 'Amalaki'],
            'PITTA': ['Amalaki', 'Guduchi', 'Neem'],
            'KAPHA': ['Turmeric', 'Tulsi', 'Trikatu'],
        },
        'lifestyle_tips': [
            'Regular sleep schedule',
            'Adequate hydration',
            'Balanced diet',
            'Moderate exercise'
        ],
    },
    'digestion': {
        'description': 'Improve digestive health and metabolism',
        'recommended_herbs': ['Triphala', 'Ginger', 'Fennel', 'Cumin', 'Hingvastak'],
        'dosha_recommendations': {
            'VATA': ['Ginger', 'Asafoetida', 'Ajwain'],
            'PITTA': ['Coriander', 'Fennel', 'Mint'],
            'KAPHA': ['Black Pepper', 'Trikatu', 'Ginger'],
        },
        'lifestyle_tips': [
            'Eat at regular times',
            'Avoid overeating',
            'Include all six tastes',
            'Walk after meals'
        ],
    },
    'stress_relief': {
        'description': 'Reduce stress and promote mental calm',
        'recommended_herbs': ['Ashwagandha', 'Brahmi', 'Jatamansi', 'Shankhpushpi'],
        'dosha_recommendations': {
            'VATA': ['Ashwagandha', 'Brahmi', 'Tagara'],
            'PITTA': ['Brahmi', 'Jatamansi', 'Shatavari'],
            'KAPHA': ['Brahmi', 'Tulsi', 'Guggulu'],
        },
        'lifestyle_tips': [
            'Regular meditation',
            'Yoga practice',
            'Adequate sleep',
            'Reduce stimulants'
        ],
    },
    'sleep': {
        'description': 'Improve sleep quality and duration',
        'recommended_herbs': ['Ashwagandha', 'Brahmi', 'Jatamansi', 'Tagara'],
        'dosha_recommendations': {
            'VATA': ['Ashwagandha', 'Tagara', 'Warm milk with nutmeg'],
            'PITTA': ['Brahmi', 'Shatavari', 'Cool milk'],
            'KAPHA': ['Trikatu', 'Brahmi', 'Light evening meal'],
        },
        'lifestyle_tips': [
            'Regular sleep schedule',
            'Avoid screens before bed',
            'Light evening meals',
            'Oil massage (Abhyanga)'
        ],
    },
    'skin_health': {
        'description': 'Promote healthy, glowing skin',
        'recommended_herbs': ['Turmeric', 'Neem', 'Manjistha', 'Aloe Vera'],
        'dosha_recommendations': {
            'VATA': ['Ashwagandha', 'Shatavari', 'Sesame oil'],
            'PITTA': ['Neem', 'Manjistha', 'Coconut oil'],
            'KAPHA': ['Turmeric', 'Neem', 'Light oils'],
        },
        'lifestyle_tips': [
            'Adequate hydration',
            'Balanced diet',
            'Regular cleansing',
            'Sun protection'
        ],
    },
    'joint_health': {
        'description': 'Support joint flexibility and reduce inflammation',
        'recommended_herbs': ['Turmeric', 'Guggulu', 'Ashwagandha', 'Shallaki'],
        'dosha_recommendations': {
            'VATA': ['Ashwagandha', 'Guggulu', 'Warm oil massage'],
            'PITTA': ['Turmeric', 'Guduchi', 'Cool applications'],
            'KAPHA': ['Guggulu', 'Trikatu', 'Dry heat'],
        },
        'lifestyle_tips': [
            'Regular gentle exercise',
            'Yoga and stretching',
            'Maintain healthy weight',
            'Anti-inflammatory diet'
        ],
    },
}


def get_dosha_recommendations(dosha_type: str, health_goal: Optional[str] = None) -> Dict:
    """
    Get personalized recommendations based on dosha and health goal

    Args:
        dosha_type: Primary dosha (VATA, PITTA, or KAPHA)
        health_goal: Optional specific health goal

    Returns:
        Dictionary with personalized recommendations
    """
    dosha_type = dosha_type.upper()

    if dosha_type not in DOSHA_PROPERTIES:
        raise ValueError(f"Invalid dosha type: {dosha_type}")

    recommendations = {
        'dosha': dosha_type,
        'properties': DOSHA_PROPERTIES[dosha_type],
    }

    if health_goal and health_goal in HEALTH_GOALS:
        goal_data = HEALTH_GOALS[health_goal]
        recommendations['health_goal'] = {
            'name': health_goal,
            'description': goal_data['description'],
            'recommended_herbs': goal_data['dosha_recommendations'].get(dosha_type, []),
            'lifestyle_tips': goal_data['lifestyle_tips'],
        }

    return recommendations


def get_ingredient_compatibility(ingredient_name: str, dosha_type: str) -> Dict:
    """
    Check if an ingredient is compatible with a dosha type

    Args:
        ingredient_name: Name of the herb/ingredient
        dosha_type: Dosha type to check compatibility

    Returns:
        Compatibility information
    """
    if ingredient_name not in INGREDIENT_PROPERTIES:
        return {'compatible': False, 'message': 'Ingredient not found'}

    ingredient = INGREDIENT_PROPERTIES[ingredient_name]
    dosha_effect = ingredient['dosha_effect'].get(dosha_type.upper(), 'neutral')

    return {
        'compatible': 'balances' in dosha_effect.lower(),
        'effect': dosha_effect,
        'benefits': ingredient['benefits'],
        'contraindications': ingredient['contraindications'],
    }


def calculate_product_dosha_score(product: Dict, user_dosha: str) -> float:
    """
    Calculate how well a product matches a user's dosha

    Args:
        product: Product dictionary with ingredients
        user_dosha: User's primary dosha type

    Returns:
        Compatibility score between 0 and 1
    """
    if 'ingredients' not in product:
        return 0.5  # Neutral score for products without ingredient info

    ingredients = product['ingredients']
    if not isinstance(ingredients, list):
        return 0.5

    score = 0.5  # Base score
    matching_ingredients = 0

    for ingredient in ingredients:
        if ingredient in INGREDIENT_PROPERTIES:
            effect = INGREDIENT_PROPERTIES[ingredient]['dosha_effect'].get(user_dosha.upper(), '')
            if 'balances' in effect.lower():
                score += 0.1
                matching_ingredients += 1
            elif 'increase' in effect.lower():
                score -= 0.05

    # Normalize score to 0-1 range
    score = max(0, min(1, score))

    return score
