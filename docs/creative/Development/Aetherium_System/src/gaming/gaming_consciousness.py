"""
No Man's Sky Gaming Consciousness Module
Provides specialized consciousness processing for gaming experiences
"""

class GamingConsciousness:
    """Consciousness engine specialized for gaming context and narrative generation"""
    
    def __init__(self):
        self.nms_patterns = self.load_nms_patterns()
        self.galactic_hub_data = self.load_galactic_hub_data()
        self.narrative_templates = self.load_narrative_templates()
        self.resource_database = self.load_resource_database()
    
    def load_galactic_hub_data(self):
        """Load Galactic Hub specific data"""
        return {
            'regions': [
                'The Arm of Vezitinen', 'Canthian', 'Dexanyi', 'Eapustafiges', 
                'Etarciel', 'Faifurmo', 'Felliti', 'Hatrike', 'Iousongola',
                'Kogii\'ithip', 'Lennogband', 'Loychazinq', 'Matriika', 
                'Nugsdorch', 'Olliark', 'Pihmidgar', 'Qandovart', 'Rashes', 
                'Renbellanj', 'Siveness', 'Tottiginn', 'Uefertull', 'Unea Prime',
                'Vihaginn', 'Wazwudah', 'Yipioh', 'Zahmanuza'
            ],
            'key_systems': {
                'Drogradur NO426': 'Capital System',
                'Othlys V': 'Diplomatic Hub',
                'Quetzalcoatl\'s Sun': 'Scientific Research Center'
            },
            'naming_tags': {
                'hub1': 'The Arm of Vezitinen (Capital Region)',
                'hub2': 'Canthian',
                'hub3': 'Dexanyi',
                'hub4': 'Eapustafiges',
                'hub5': 'Etarciel',
                'hub6': 'Faifurmo',
                'hub7': 'Felliti',
                'hub8': 'Hatrike',
                'hub9': 'Iousongola',
                'hub10': 'Kogii\'ithip',
                'hub11': 'Lennogband'
            }
        }

    def load_nms_patterns(self):
        """Load No Man's Sky specific pattern recognition data"""
        return {
            'planet_types': {
                'paradise': ['lush', 'beautiful', 'perfect', 'ideal', 'garden', 'viridescent', 'tropical', 'bountiful'],
                'toxic': ['poison', 'toxic', 'hazardous', 'contaminated', 'acrid', 'noxious'],
                'frozen': ['ice', 'frozen', 'cold', 'arctic', 'glacial', 'frost', 'sub-zero'],
                'scorched': ['hot', 'burning', 'fire', 'volcanic', 'lava', 'scalding', 'charred'],
                'radioactive': ['radiation', 'radioactive', 'nuclear', 'irradiated', 'gamma'],
                'barren': ['dead', 'lifeless', 'empty', 'desolate', 'barren', 'low atmosphere', 'airless'],
                'exotic': ['sharded', 'pillared', 'hex', 'bubble', 'hydro', 'wire', 'mechanical']
            },
            'sentinel_levels': {
                'passive': ['low', 'passive', 'calm', 'peaceful', 'none', 'minimal'],
                'aggressive': ['high', 'aggressive', 'hostile', 'dangerous', 'extreme', 'hateful']
            },
            'fauna_traits': {
                'peaceful': ['peaceful', 'calm', 'gentle', 'docile', 'friendly'],
                'aggressive': ['aggressive', 'hostile', 'predator', 'dangerous', 'violent'],
                'rare': ['unique', 'rare', 'unusual', 'special', 'exotic', 'diplo', 'mega']
            },
            'hub_indicators': {
                'territory': ['hub', 'galactic hub', 'capital', 'colony', 'census', 'interloper'],
                'location': ['arm of vezitinen', 'drogradur', 'othlys', 'new lennon']
            }
        }
    
    def detect_patterns(self, description, discovery_type):
        """Detect patterns in the discovery description"""
        desc_lower = description.lower()
        patterns = {
            'type': discovery_type,
            'characteristics': [],
            'mood': 'neutral',
            'resources': [],
            'hub_context': False,
            'hub_region': None
        }
        
        # Detect Galactic Hub context
        for indicator in self.nms_patterns.get('hub_indicators', {}).get('territory', []):
            if indicator in desc_lower:
                patterns['hub_context'] = True
                break
                
        # Detect specific Hub regions
        for region in self.galactic_hub_data['regions']:
            if region.lower() in desc_lower:
                patterns['hub_context'] = True
                patterns['hub_region'] = region
                break
        
        # Detect planet characteristics
        if discovery_type == 'planet':
            for planet_type, keywords in self.nms_patterns['planet_types'].items():
                if any(kw in desc_lower for kw in keywords):
                    patterns['characteristics'].append(planet_type)
            
            # Detect sentinel level
            for level, keywords in self.nms_patterns['sentinel_levels'].items():
                if any(kw in desc_lower for kw in keywords):
                    patterns['sentinel_level'] = level
        
        # Detect fauna traits
        elif discovery_type == 'fauna':
            for trait, keywords in self.nms_patterns['fauna_traits'].items():
                if any(kw in desc_lower for kw in keywords):
                    patterns['characteristics'].append(trait)
        
        # Detect resources mentioned
        for resource_type, resources in self.resource_database.items():
            if resource_type != 'crafting_chains':
                for resource in resources:
                    if resource.replace('_', ' ') in desc_lower:
                        patterns['resources'].append(resource)
        
        return patterns

    def suggest_naming(self, patterns, discovery_type):
        """Suggest naming based on patterns and Hub context"""
        suggestions = []
        
        # Galactic Hub Naming Protocol
        if patterns.get('hub_context'):
            region_tag = "HUB"
            if patterns.get('hub_region') == 'The Arm of Vezitinen':
                region_tag = "HUB1"
            elif patterns.get('hub_region') == 'Canthian':
                region_tag = "HUB2"
            # Add simple system/planet suffix if not specified
            suggestions.append(f"[{region_tag}-X-1] {discovery_type.title()}")
            suggestions.append(f"[{region_tag}-$-2] {discovery_type.title()}")

        if discovery_type == 'planet':
            if 'paradise' in patterns.get('characteristics', []):
                suggestions.extend(['Eden Prime', 'Sanctuary', 'Haven', 'Elysium', 'New Lennon II'])
            elif 'toxic' in patterns.get('characteristics', []):
                suggestions.extend(['Venom', 'Toxis', 'Miasma', 'Blight'])
            elif 'frozen' in patterns.get('characteristics', []):
                suggestions.extend(['Glacius', 'Frostheim', 'Cryos', 'Winterfall'])
        
        elif discovery_type == 'fauna':
            if 'peaceful' in patterns.get('characteristics', []):
                suggestions.extend(['Pacificus', 'Tranquilis', 'Serenitas'])
            elif 'rare' in patterns.get('characteristics', []):
                suggestions.extend(['Rarissimus', 'Unicus', 'Singularis'])
        
        return suggestions[0] if suggestions else f"New {discovery_type.title()}"

    def generate_insights(self, patterns, discovery_type):
        """Generate exploration insights based on patterns"""
        insights = []
        
        if patterns.get('hub_context'):
            insights.append("You are in Galactic Hub territory. Adherence to Hub Naming Guidelines is recommended.")
            if patterns.get('hub_region'):
                insights.append(f"Identified Region: {patterns['hub_region']}. Check local census for established colonies.")
        
        if discovery_type == 'planet':
            # Sentinel insights
            if patterns.get('sentinel_level') == 'passive':
                insights.append("Low sentinel presence allows for extended surface exploration and base building opportunities.")
            elif patterns.get('sentinel_level') == 'aggressive':
                insights.append("High sentinel activity detected. Recommend stealth approach and quick resource gathering.")
            
            # Environment insights
            if 'paradise' in patterns.get('characteristics', []):
                insights.append("Paradise worlds often harbor rare flora and fauna. Ideal for settlement or Hub colony.")
            elif 'toxic' in patterns.get('characteristics', []):
                insights.append("Toxic environments may yield unique resources. Ensure hazard protection is maintained.")
        
        elif discovery_type == 'fauna':
            if 'peaceful' in patterns.get('characteristics', []):
                insights.append("Peaceful fauna can be approached safely. Consider taming for companionship.")
            elif 'aggressive' in patterns.get('characteristics', []):
                insights.append("Predatory behavior detected. Maintain safe distance and prepare defensive measures.")
            if 'rare' in patterns.get('characteristics', []):
                insights.append("Rare species detected. Document immediately for the Galactic Hub Exobiology Corps.")
        
        return insights if insights else ["This discovery adds to your growing understanding of the cosmos."]
    
    def analyze_resources(self, patterns, description):
        """Analyze resource optimization opportunities"""
        tips = []
        
        resources = patterns.get('resources', [])
        if resources:
            tips.append(f"Detected resources: {', '.join(resources)}. Prioritize collection based on current needs.")
        
        # Check for crafting chain opportunities
        for chain_name, chain_resources in self.resource_database['crafting_chains'].items():
            if any(r in resources for r in chain_resources):
                tips.append(f"Resources present for {chain_name.replace('_', ' ')} crafting chain.")
        
        return tips if tips else ["Survey the area thoroughly for optimal resource distribution."]
    
    def detect_emotion(self, description):
        """Detect emotional context in description"""
        desc_lower = description.lower()
        
        positive_words = ['beautiful', 'amazing', 'wonderful', 'perfect', 'incredible', 'stunning']
        negative_words = ['dangerous', 'hostile', 'harsh', 'difficult', 'extreme', 'deadly']
        wonder_words = ['mysterious', 'ancient', 'strange', 'unusual', 'unique', 'rare']
        
        if any(word in desc_lower for word in positive_words):
            return 'wonder'
        elif any(word in desc_lower for word in negative_words):
            return 'caution'
        elif any(word in desc_lower for word in wonder_words):
            return 'curiosity'
        
        return 'exploration'


# Singleton instance
gaming_consciousness = GamingConsciousness()


def process_gaming_discovery(discovery_type, description, context=None):
    """
    Main entry point for processing gaming discoveries
    
    Args:
        discovery_type: Type of discovery
        description: User description
        context: Optional context
    
    Returns:
        Processed discovery with insights and narrative
    """
    return gaming_consciousness.process_discovery(discovery_type, description, context)
