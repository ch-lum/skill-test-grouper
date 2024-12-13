# Question 1
def add_title(*args, title="Dr."):
    '''
    Function that adds a title to each person's 
    name, or "Dr." if no title was provided.

    args:
        *args (strings): variable number of names
        title (string, optional): title to precede each 
            name, default is "Dr."
    returns:
        list: list of strings with title added to each name

    >>> add_title("Mike")
    ['Dr. Mike']
    >>> add_title("John", "Jane", "Joe")
    ['Dr. John', 'Dr. Jane', 'Dr. Joe']
    >>> add_title("Jack", "John", "Jeff", title="Mr.")
    ['Mr. Jack', 'Mr. John', 'Mr. Jeff']
    '''
    # YOUR CODE GOES HERE
    return [f"{title} {name}" for name in args]

    

# Question 2
def invite(cities, **kwargs):
    '''
    Function that invites people if they reside in 
    certain cities

    args:
        cities (list): list of city names
        **kwargs: names and cities of residence
            key: person's name
            value (string): city of residence
    returns:
        list of strings indicating who's invited

    >>> invite(["NYC", "SD"], John="LA", Jack="SD", Jeff="NYC")
    ['Jack is invited', 'Jeff is invited']
    >>> invite(["NYC", "SD"], Jill="SF", Jen="LA", Jane="SLO")
    []
    '''
    # YOUR CODE GOES HERE
    invited = []
    for name, city in kwargs.items():
        if city in cities:
            invited.append(f"{name} is invited")
    return invited
    
        
# Question 3
def equal_funcs(num1, num2, f1, f2):
    '''
    Function that checks whether two functions return
    the same output for two inputs

    args:
        num1 (int): first input
        num2 (int): second input
        f1 (func): first function
        f2 (func): second function
    returns:
        True if the functions return the same output
        for both inputs, False otherwise

    >>> equal_funcs(5, -5, lambda x: x * -1 if x < 0 else x, abs)
    True
    >>> equal_funcs(5, -5, lambda x: x * -1, abs)
    False
    '''
    # YOUR CODE GOES HERE
    return f1(num1) == f2(num1) and f1(num2) == f2(num2)


# Question 4
def factorial(n):
    '''
    Function that recursively calculates factorial of a number

    args:
        n (int): positive integer
    returns:
        n! (n factorial)
    
    >>> factorial(1)
    1
    >>> factorial(5) # 5 * 4 * 3 * 2 * 1 = 120
    120
    '''
    # YOUR CODE GOES HERE
    if n == 1 and n>0:
        return 1
    else:
        return factorial(n*(n-1))
    
    
