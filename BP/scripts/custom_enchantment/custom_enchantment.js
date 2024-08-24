export class CustomEnchantment {
    constructor(name, level, conflicts, maxUsage, usage, id, dynamicPropId) {
        this.id = id;
        this.name = name;
        this.level = level;
        this.conflicts = conflicts ?? [];
        this._maxUsage = maxUsage;
        this._usage = usage ?? maxUsage;
        this._dynamicPropertyIdentifier = dynamicPropId;
    }
    damageUsage(decrementedValue = 1) {
        if (!this.source)
            throw "Source of Itemstack doesn't exists in Custom Enchantment in Update method";
        this._usage = this.usage;
        this._usage -= decrementedValue;
        if (this._usage <= 1) {
            this.source.setDynamicProperty(`Fishing${this._dynamicPropertyIdentifier}Usage`, undefined);
            this.source.setDynamicProperty(`Fishing${this._dynamicPropertyIdentifier}MaxUsage`, undefined);
            this.source.enchantment.override(this.source).removeCustomEnchantment(this);
            return true;
        }
        this.source.setDynamicProperty(`Fishing${this._dynamicPropertyIdentifier}Usage`, this._usage);
        return false;
    }
    get usage() {
        if (!this.source)
            throw "Source of Itemstack doesn't exists in Custom Enchantment in usage getter";
        this._usage = this.source.getDynamicProperty(`Fishing${this._dynamicPropertyIdentifier}Usage`) ?? this._usage;
        return this._usage;
    }
    get maxUsage() {
        if (!this.source)
            throw "Source of Itemstack doesn't exists in Custom Enchantment in maxUsage getter";
        this._maxUsage = this.source.getDynamicProperty(`Fishing${this._dynamicPropertyIdentifier}MaxUsage`) ?? this._maxUsage;
        return this._maxUsage;
    }
    create(source) {
        this.init(source);
        this.source.setDynamicProperty(`Fishing${this._dynamicPropertyIdentifier}Usage`, this._usage);
        this.source.setDynamicProperty(`Fishing${this._dynamicPropertyIdentifier}MaxUsage`, this.maxUsage);
    }
    init(source) {
        this.source = source;
        this._usage = this.usage;
        this._maxUsage = this.maxUsage;
    }
    static from(ref) {
        return new CustomEnchantment(ref.name, ref.level, ref.conflicts, ref.maxUsage, ref.usage, ref.id, ref.dynamicPropId);
    }
}
